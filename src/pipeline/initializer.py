"""Bootstrap initialization for monocular visual odometry."""

from __future__ import annotations

import logging
from dataclasses import dataclass

import numpy as np

from src.config import GeometryConfig, InitializationConfig, TriangulationConfig
from src.dataset.base_dataset import BaseDataset, Frame
from src.features.detector import FeatureDetector, FeatureSet
from src.features.matcher import FeatureMatcher
from src.geometry.essential import estimate_relative_pose
from src.geometry.reprojection import compute_mean_reprojection_error
from src.geometry.transforms import pose_from_rt
from src.geometry.triangulation import (
    build_projection_matrix,
    compute_parallax_angles,
    filter_triangulated_points,
    triangulate_points,
)

LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class InitializationResult:
    """Result of initializer bootstrap search."""

    success: bool
    frame_idx_1: int = -1
    frame_idx_2: int = -1
    T1_cw: np.ndarray | None = None
    T2_cw: np.ndarray | None = None
    points_3d: np.ndarray | None = None
    keypoints_1: np.ndarray | None = None
    keypoints_2: np.ndarray | None = None
    matched_indices_1: np.ndarray | None = None
    matched_indices_2: np.ndarray | None = None
    descriptors_1: np.ndarray | None = None
    descriptors_2: np.ndarray | None = None
    num_matches: int = 0
    num_inliers: int = 0
    mean_parallax_deg: float = 0.0
    mean_reproj_error: float = 0.0
    diagnostics: str = ""


class MonocularInitializer:
    """Search early frame pairs for a stable bootstrap initialization."""

    def __init__(
        self,
        dataset: BaseDataset,
        detector: FeatureDetector,
        matcher: FeatureMatcher,
        geometry_config: GeometryConfig,
        initialization_config: InitializationConfig,
        triangulation_config: TriangulationConfig,
    ) -> None:
        self.dataset = dataset
        self.detector = detector
        self.matcher = matcher
        self.geometry_config = geometry_config
        self.initialization_config = initialization_config
        self.triangulation_config = triangulation_config
        self.camera = dataset.get_intrinsics()

    def try_initialize(self) -> InitializationResult:
        """Search for a valid seed pair and triangulate initial map points."""
        search_limit = min(len(self.dataset), self.initialization_config.max_search_frames)
        feature_cache: dict[int, tuple[Frame, FeatureSet]] = {}

        for first_idx in range(search_limit - 1):
            first_frame, first_features = self._get_cached_features(first_idx, feature_cache)
            for second_idx in range(first_idx + 1, search_limit):
                second_frame, second_features = self._get_cached_features(second_idx, feature_cache)
                result = self._evaluate_pair(
                    first_idx,
                    second_idx,
                    first_frame,
                    second_frame,
                    first_features,
                    second_features,
                )
                if result.success:
                    LOGGER.info(
                        "Initialization succeeded with frames %s and %s.",
                        first_idx,
                        second_idx,
                    )
                    return result
                LOGGER.info(
                    "Initialization pair %s-%s rejected: %s",
                    first_idx,
                    second_idx,
                    result.diagnostics,
                )
        return InitializationResult(success=False, diagnostics="No valid initialization pair found.")

    def _evaluate_pair(
        self,
        first_idx: int,
        second_idx: int,
        first_frame: Frame,
        second_frame: Frame,
        first_features: FeatureSet,
        second_features: FeatureSet,
    ) -> InitializationResult:
        """Evaluate a candidate frame pair for bootstrap suitability."""
        matches = self.matcher.match(first_features.descriptors, second_features.descriptors)
        if len(matches) < self.initialization_config.min_matches:
            return InitializationResult(
                success=False,
                diagnostics=f"only {len(matches)} matches",
                num_matches=len(matches),
            )

        points_1 = np.asarray(
            [first_features.keypoints[match.queryIdx].pt for match in matches],
            dtype=np.float64,
        )
        points_2 = np.asarray(
            [second_features.keypoints[match.trainIdx].pt for match in matches],
            dtype=np.float64,
        )

        try:
            pose_result = estimate_relative_pose(
                points_a=points_1,
                points_b=points_2,
                camera=self.camera,
                ransac_threshold=self.geometry_config.ransac_threshold,
                confidence=self.geometry_config.confidence,
            )
        except ValueError as error:
            return InitializationResult(success=False, diagnostics=str(error), num_matches=len(matches))

        inlier_mask = pose_result.inlier_mask
        num_inliers = int(np.count_nonzero(inlier_mask))
        if num_inliers < self.initialization_config.min_inliers:
            return InitializationResult(
                success=False,
                diagnostics=f"only {num_inliers} inliers",
                num_matches=len(matches),
                num_inliers=num_inliers,
            )

        inlier_points_1 = points_1[inlier_mask]
        inlier_points_2 = points_2[inlier_mask]
        matched_indices_1 = np.asarray(
            [matches[index].queryIdx for index, is_inlier in enumerate(inlier_mask) if is_inlier],
            dtype=np.int32,
        )
        matched_indices_2 = np.asarray(
            [matches[index].trainIdx for index, is_inlier in enumerate(inlier_mask) if is_inlier],
            dtype=np.int32,
        )

        T1_cw = np.eye(4, dtype=np.float64)
        T2_cw = pose_from_rt(pose_result.rotation, pose_result.translation)
        P1 = build_projection_matrix(self.camera.K, T1_cw)
        P2 = build_projection_matrix(self.camera.K, T2_cw)
        points_3d = triangulate_points(P1, P2, inlier_points_1, inlier_points_2)
        filtered_points, valid_mask = filter_triangulated_points(
            points_3d=points_3d,
            K=self.camera.K,
            T1_cw=T1_cw,
            T2_cw=T2_cw,
            pts1=inlier_points_1,
            pts2=inlier_points_2,
            max_reproj_error=self.initialization_config.max_reproj_error,
            min_parallax_deg=self.initialization_config.min_parallax_deg,
            min_depth=self.triangulation_config.min_depth,
        )
        if len(filtered_points) < self.initialization_config.min_inliers:
            return InitializationResult(
                success=False,
                diagnostics=f"only {len(filtered_points)} valid triangulated points",
                num_matches=len(matches),
                num_inliers=num_inliers,
            )

        mean_parallax = float(
            np.mean(compute_parallax_angles(filtered_points, T1_cw=T1_cw, T2_cw=T2_cw))
        )
        if mean_parallax < self.initialization_config.min_parallax_deg:
            return InitializationResult(
                success=False,
                diagnostics=f"mean parallax {mean_parallax:.2f} deg",
                num_matches=len(matches),
                num_inliers=num_inliers,
                mean_parallax_deg=mean_parallax,
            )

        filtered_indices_1 = matched_indices_1[valid_mask]
        filtered_indices_2 = matched_indices_2[valid_mask]
        filtered_points_1 = inlier_points_1[valid_mask]
        filtered_points_2 = inlier_points_2[valid_mask]
        mean_reproj_error = 0.5 * (
            compute_mean_reprojection_error(self.camera.K, T1_cw, filtered_points, filtered_points_1)
            + compute_mean_reprojection_error(self.camera.K, T2_cw, filtered_points, filtered_points_2)
        )

        return InitializationResult(
            success=True,
            frame_idx_1=first_idx,
            frame_idx_2=second_idx,
            T1_cw=T1_cw,
            T2_cw=T2_cw,
            points_3d=filtered_points,
            keypoints_1=np.asarray([keypoint.pt for keypoint in first_features.keypoints], dtype=np.float64),
            keypoints_2=np.asarray([keypoint.pt for keypoint in second_features.keypoints], dtype=np.float64),
            matched_indices_1=filtered_indices_1,
            matched_indices_2=filtered_indices_2,
            descriptors_1=first_features.descriptors,
            descriptors_2=second_features.descriptors,
            num_matches=len(matches),
            num_inliers=num_inliers,
            mean_parallax_deg=mean_parallax,
            mean_reproj_error=mean_reproj_error,
            diagnostics=f"{len(filtered_points)} seed points",
        )

    def _get_cached_features(
        self,
        frame_idx: int,
        cache: dict[int, tuple[Frame, FeatureSet]],
    ) -> tuple[Frame, FeatureSet]:
        """Load and cache frame features for repeated initializer scans."""
        if frame_idx not in cache:
            frame = self.dataset.get_frame(frame_idx)
            cache[frame_idx] = (frame, self.detector.detect_and_compute(frame.image_gray))
        return cache[frame_idx]
