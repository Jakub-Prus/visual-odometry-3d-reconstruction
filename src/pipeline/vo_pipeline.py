"""Staged monocular visual odometry pipeline with bootstrap and tracking modes."""

from __future__ import annotations

import logging
from pathlib import Path

import numpy as np

from src.config import (
    GeometryConfig,
    InitializationConfig,
    KeyframeConfig,
    PnPConfig,
    TrackingConfig,
    TriangulationConfig,
)
from src.dataset.base_dataset import BaseDataset
from src.features.detector import FeatureDetector, FeatureSet
from src.features.matcher import FeatureMatcher
from src.features.tracking import build_2d3d_correspondences, match_frame_to_keyframe
from src.geometry.essential import estimate_relative_pose
from src.geometry.pnp import PnPResult, estimate_pose_pnp
from src.geometry.reprojection import compute_reprojection_errors, project_points
from src.geometry.transforms import (
    compose_poses,
    invert_pose,
    pose_from_rt,
    rotation_angle_degrees,
)
from src.geometry.triangulation import (
    build_projection_matrix,
    filter_triangulated_points,
    triangulate_points,
)
from src.map.keyframe import Keyframe
from src.map.map_manager import MapManager
from src.pipeline.initializer import InitializationResult, MonocularInitializer
from src.pipeline.state import FrameRecord, PipelineState
from src.utils.io import ensure_directory
from src.visualization.debug_vis import draw_feature_matches, draw_reprojected_points
from src.visualization.pointcloud_vis import export_pointcloud_ply
from src.visualization.trajectory_vis import save_trajectory_plot

LOGGER = logging.getLogger(__name__)
MIN_ESSENTIAL_MATCHES = 8
DEFAULT_OUTPUT_ROOT = "outputs"
TRAJECTORY_FILE_NAME = "trajectory.txt"
POINTCLOUD_FILE_NAME = "sparse_map.ply"


class VisualOdometryPipeline:
    """Estimate poses, bootstrap a sparse map, and track with PnP when possible."""

    def __init__(
        self,
        dataset: BaseDataset,
        detector: FeatureDetector,
        matcher: FeatureMatcher,
        geometry_config: GeometryConfig,
        initialization_config: InitializationConfig | None = None,
        triangulation_config: TriangulationConfig | None = None,
        tracking_config: TrackingConfig | None = None,
        pnp_config: PnPConfig | None = None,
        keyframe_config: KeyframeConfig | None = None,
        output_root: str | Path = DEFAULT_OUTPUT_ROOT,
    ) -> None:
        self.dataset = dataset
        self.detector = detector
        self.matcher = matcher
        self.geometry_config = geometry_config
        self.initialization_config = initialization_config or InitializationConfig()
        self.triangulation_config = triangulation_config or TriangulationConfig()
        self.tracking_config = tracking_config or TrackingConfig()
        self.pnp_config = pnp_config or PnPConfig()
        self.keyframe_config = keyframe_config or KeyframeConfig()
        self.camera = dataset.get_intrinsics()
        self.state = PipelineState()
        self.map_manager = MapManager()
        self.initializer = MonocularInitializer(
            dataset=dataset,
            detector=detector,
            matcher=matcher,
            geometry_config=geometry_config,
            initialization_config=self.initialization_config,
            triangulation_config=self.triangulation_config,
        )
        self.output_root = Path(output_root)
        self.output_dirs = {
            "trajectories": ensure_directory(self.output_root / "trajectories"),
            "pointclouds": ensure_directory(self.output_root / "pointclouds"),
            "logs": ensure_directory(self.output_root / "logs"),
            "debug": ensure_directory(self.output_root / "debug"),
        }

    def run(self, max_frames: int = 50) -> PipelineState:
        """Run bootstrap and tracking over the dataset."""
        if len(self.dataset) < 2:
            raise ValueError("The dataset must contain at least two frames.")

        initialization_result = self.initializer.try_initialize()
        if not initialization_result.success:
            raise RuntimeError(initialization_result.diagnostics)
        self._apply_initialization(initialization_result)

        previous_frame_id = initialization_result.frame_idx_2
        previous_frame = self.dataset.get_frame(previous_frame_id)
        previous_features = self.detector.detect_and_compute(previous_frame.image_gray)

        frame_limit = min(max_frames, len(self.dataset))
        for frame_id in range(initialization_result.frame_idx_2 + 1, frame_limit):
            frame = self.dataset.get_frame(frame_id)
            features = self.detector.detect_and_compute(frame.image_gray)
            pose_cw, pnp_result, correspondences = self._estimate_tracking_pose(features, previous_features)

            mode = "tracking"
            num_matches = len(correspondences.matches)
            num_inliers = pnp_result.num_inliers if pnp_result.success else 0
            mean_error = pnp_result.mean_reproj_error if pnp_result.success else float("inf")

            if pose_cw is None:
                fallback_pose, fallback_inliers, fallback_matches = self._fallback_pose(previous_features, features)
                if fallback_pose is None:
                    LOGGER.warning("Frame %s skipped: tracking and fallback failed.", frame_id)
                    previous_frame = frame
                    previous_features = features
                    continue
                pose_cw = fallback_pose
                num_inliers = fallback_inliers
                num_matches = fallback_matches
                mean_error = float("inf")
                mode = "fallback"

            record = FrameRecord(
                frame_id=frame_id,
                image_path=str(frame.path),
                pose_cw=pose_cw.copy(),
                num_keypoints=len(features.keypoints),
                num_matches=num_matches,
                num_inliers=num_inliers,
                mode=mode,
                mean_reprojection_error=mean_error,
            )

            inserted_keyframe = None
            if self._should_insert_keyframe(pose_cw, num_inliers):
                inserted_keyframe = self._insert_keyframe(
                    frame_id=frame_id,
                    image_path=str(frame.path),
                    pose_cw=pose_cw,
                    features=features,
                    pnp_result=pnp_result,
                    correspondences=correspondences,
                )
                record.num_triangulated = self._grow_map(inserted_keyframe)
                self.map_manager.prune_invalid_points(
                    max_reproj_error=self.tracking_config.max_reproj_error,
                    min_track_length=self.tracking_config.min_track_length,
                )

            self.state.add_frame_record(record)
            self.state.sparse_points = [
                point.xyz.copy() for point in self.map_manager.get_active_points(self.tracking_config.min_track_length)
            ]

            LOGGER.info(
                "Frame %s | mode=%s kp=%s matches=%s inliers=%s map_points=%s keyframes=%s",
                frame_id,
                mode,
                record.num_keypoints,
                record.num_matches,
                record.num_inliers,
                len(self.map_manager.get_active_points(1)),
                len(self.map_manager.keyframes),
            )
            if inserted_keyframe is not None and pnp_result.success and correspondences.points_3d.size > 0:
                self._save_debug_reprojections(frame.image_gray, pose_cw, correspondences, pnp_result, frame_id)

            previous_frame = frame
            previous_features = features

        self._finalize_outputs()
        return self.state

    def _apply_initialization(self, result: InitializationResult) -> None:
        """Seed the map and state from a successful initializer result."""
        if result.points_3d is None or result.matched_indices_1 is None or result.matched_indices_2 is None:
            raise RuntimeError("Initialization result is incomplete.")

        first_frame = self.dataset.get_frame(result.frame_idx_1)
        second_frame = self.dataset.get_frame(result.frame_idx_2)

        keyframe_1 = self.map_manager.create_keyframe(
            frame_id=result.frame_idx_1,
            image_path=str(first_frame.path),
            pose_cw=result.T1_cw,
            keypoints=result.keypoints_1 if result.keypoints_1 is not None else np.empty((0, 2)),
            descriptors=result.descriptors_1,
        )
        keyframe_2 = self.map_manager.create_keyframe(
            frame_id=result.frame_idx_2,
            image_path=str(second_frame.path),
            pose_cw=result.T2_cw,
            keypoints=result.keypoints_2 if result.keypoints_2 is not None else np.empty((0, 2)),
            descriptors=result.descriptors_2,
        )

        point_descriptors = None
        if result.descriptors_2 is not None:
            point_descriptors = result.descriptors_2[result.matched_indices_2]
        self.map_manager.add_map_points(
            points_3d=result.points_3d,
            descriptors=point_descriptors,
            keyframe_a=keyframe_1,
            indices_a=result.matched_indices_1,
            keyframe_b=keyframe_2,
            indices_b=result.matched_indices_2,
        )

        self.state.initialized = True
        self.state.last_keyframe_id = keyframe_2.keyframe_id
        self.state.sparse_points = [point.copy() for point in result.points_3d]
        self.state.add_frame_record(
            FrameRecord(
                frame_id=result.frame_idx_1,
                image_path=str(first_frame.path),
                pose_cw=result.T1_cw,
                num_keypoints=len(keyframe_1.keypoints),
                num_matches=0,
                num_inliers=0,
                num_triangulated=0,
                mode="bootstrap",
                mean_reprojection_error=0.0,
            )
        )
        self.state.add_frame_record(
            FrameRecord(
                frame_id=result.frame_idx_2,
                image_path=str(second_frame.path),
                pose_cw=result.T2_cw,
                num_keypoints=len(keyframe_2.keypoints),
                num_matches=result.num_matches,
                num_inliers=result.num_inliers,
                num_triangulated=len(result.points_3d),
                mode="bootstrap",
                mean_reprojection_error=result.mean_reproj_error,
            )
        )
        self._save_initialization_debug(result, first_frame.image_gray, second_frame.image_gray)

    def _estimate_tracking_pose(
        self,
        current_features: FeatureSet,
        previous_features: FeatureSet,
    ) -> tuple[np.ndarray | None, PnPResult, object]:
        """Estimate the current pose from map correspondences."""
        last_keyframe = self.map_manager.get_last_keyframe()
        if last_keyframe is None:
            return None, PnPResult(False, None, None, 0, float("inf")), self._empty_correspondences()

        matches = match_frame_to_keyframe(self.matcher, current_features, last_keyframe)
        correspondences = build_2d3d_correspondences(matches, current_features, last_keyframe, self.map_manager)

        if not self.pnp_config.enabled or len(correspondences.points_3d) < 4:
            return None, PnPResult(False, None, None, 0, float("inf")), correspondences

        pnp_result = estimate_pose_pnp(
            points_3d=correspondences.points_3d,
            points_2d=correspondences.points_2d,
            K=self.camera.K,
            reprojection_error=self.pnp_config.reprojection_error,
            confidence=self.pnp_config.confidence,
            iterations_count=self.pnp_config.iterations_count,
        )
        if not pnp_result.success or pnp_result.num_inliers < self.pnp_config.min_inliers:
            return None, pnp_result, correspondences

        if pnp_result.inlier_indices is not None:
            reprojection_errors = compute_reprojection_errors(
                self.camera.K,
                pnp_result.T_cw,
                correspondences.points_3d[pnp_result.inlier_indices],
                correspondences.points_2d[pnp_result.inlier_indices],
            )
            self.map_manager.update_map_point_errors(
                correspondences.map_point_ids[pnp_result.inlier_indices],
                reprojection_errors,
            )
        return pnp_result.T_cw, pnp_result, correspondences

    def _fallback_pose(
        self,
        previous_features: FeatureSet,
        current_features: FeatureSet,
    ) -> tuple[np.ndarray | None, int, int]:
        """Estimate motion from frame-to-frame epipolar geometry as a fallback."""
        if self.state.current_pose_cw is None:
            return None, 0, 0
        matches = self.matcher.match(previous_features.descriptors, current_features.descriptors)
        if len(matches) < MIN_ESSENTIAL_MATCHES:
            return None, 0, len(matches)
        previous_points = np.asarray(
            [previous_features.keypoints[match.queryIdx].pt for match in matches],
            dtype=np.float64,
        )
        current_points = np.asarray(
            [current_features.keypoints[match.trainIdx].pt for match in matches],
            dtype=np.float64,
        )
        try:
            pose_result = estimate_relative_pose(
                points_a=previous_points,
                points_b=current_points,
                camera=self.camera,
                ransac_threshold=self.geometry_config.ransac_threshold,
                confidence=self.geometry_config.confidence,
            )
        except ValueError:
            return None, 0, len(matches)

        relative_pose = pose_from_rt(pose_result.rotation, pose_result.translation)
        pose_cw = compose_poses(relative_pose, self.state.current_pose_cw)
        return pose_cw, pose_result.num_inliers, len(matches)

    def _should_insert_keyframe(self, pose_cw: np.ndarray, tracked_points: int) -> bool:
        """Decide whether the current frame should become a keyframe."""
        last_keyframe = self.map_manager.get_last_keyframe()
        if last_keyframe is None:
            return True
        relative_pose = compose_poses(pose_cw, invert_pose(last_keyframe.pose_cw))
        translation = float(np.linalg.norm(relative_pose[:3, 3]))
        rotation_deg = rotation_angle_degrees(relative_pose[:3, :3])
        return (
            translation >= self.keyframe_config.min_translation
            or rotation_deg >= self.keyframe_config.min_rotation_deg
            or tracked_points < self.keyframe_config.min_tracked_points
        )

    def _insert_keyframe(
        self,
        frame_id: int,
        image_path: str,
        pose_cw: np.ndarray,
        features: FeatureSet,
        pnp_result: PnPResult,
        correspondences: object,
    ) -> Keyframe:
        """Insert a new keyframe and attach tracked map observations."""
        keypoints = np.asarray([keypoint.pt for keypoint in features.keypoints], dtype=np.float64)
        keyframe = self.map_manager.create_keyframe(
            frame_id=frame_id,
            image_path=image_path,
            pose_cw=pose_cw,
            keypoints=keypoints,
            descriptors=features.descriptors,
        )
        self.state.last_keyframe_id = keyframe.keyframe_id

        if pnp_result.success and pnp_result.inlier_indices is not None:
            for local_idx in pnp_result.inlier_indices:
                point_id = int(correspondences.map_point_ids[local_idx])
                keypoint_idx = int(correspondences.keypoint_indices[local_idx])
                self.map_manager.add_observation(point_id, keyframe, keypoint_idx)

        return keyframe

    def _grow_map(self, current_keyframe: Keyframe) -> int:
        """Triangulate and insert new map points from the last keyframe pair."""
        keyframe_ids = sorted(self.map_manager.keyframes)
        if len(keyframe_ids) < 2:
            return 0
        previous_keyframe = self.map_manager.get_keyframe(keyframe_ids[-2])

        current_features = self._feature_set_from_keyframe(current_keyframe)
        matches = match_frame_to_keyframe(self.matcher, current_features, previous_keyframe)
        new_matches = [
            match
            for match in matches
            if previous_keyframe.map_point_ids[match.trainIdx] is None
            and current_keyframe.map_point_ids[match.queryIdx] is None
        ]
        if len(new_matches) < MIN_ESSENTIAL_MATCHES:
            return 0

        points_prev = np.asarray(
            [previous_keyframe.keypoints[match.trainIdx] for match in new_matches],
            dtype=np.float64,
        )
        points_curr = np.asarray(
            [current_keyframe.keypoints[match.queryIdx] for match in new_matches],
            dtype=np.float64,
        )
        prev_indices = np.asarray([match.trainIdx for match in new_matches], dtype=np.int32)
        curr_indices = np.asarray([match.queryIdx for match in new_matches], dtype=np.int32)
        P1 = build_projection_matrix(self.camera.K, previous_keyframe.pose_cw)
        P2 = build_projection_matrix(self.camera.K, current_keyframe.pose_cw)
        points_3d = triangulate_points(P1, P2, points_prev, points_curr)
        filtered_points, valid_mask = filter_triangulated_points(
            points_3d=points_3d,
            K=self.camera.K,
            T1_cw=previous_keyframe.pose_cw,
            T2_cw=current_keyframe.pose_cw,
            pts1=points_prev,
            pts2=points_curr,
            max_reproj_error=self.triangulation_config.max_reproj_error,
            min_parallax_deg=self.triangulation_config.min_parallax_deg,
            min_depth=self.triangulation_config.min_depth,
        )
        if filtered_points.size == 0:
            return 0

        reprojection_errors = 0.5 * (
            compute_reprojection_errors(
                self.camera.K,
                previous_keyframe.pose_cw,
                filtered_points,
                points_prev[valid_mask],
            )
            + compute_reprojection_errors(
                self.camera.K,
                current_keyframe.pose_cw,
                filtered_points,
                points_curr[valid_mask],
            )
        )
        point_descriptors = None
        if current_keyframe.descriptors is not None:
            point_descriptors = current_keyframe.descriptors[curr_indices[valid_mask]]
        created_ids = self.map_manager.add_map_points(
            points_3d=filtered_points,
            descriptors=point_descriptors,
            keyframe_a=previous_keyframe,
            indices_a=prev_indices[valid_mask],
            keyframe_b=current_keyframe,
            indices_b=curr_indices[valid_mask],
            reprojection_errors=reprojection_errors,
        )
        return len(created_ids)

    def _finalize_outputs(self) -> None:
        """Save final trajectory and sparse point-cloud outputs."""
        poses = [record.pose_cw for record in self.state.trajectory]
        if poses:
            save_trajectory_plot(
                poses_cw=poses,
                output_path=self.output_dirs["trajectories"] / "trajectory.png",
            )
            self._save_trajectory_text(self.output_dirs["trajectories"] / TRAJECTORY_FILE_NAME)

        active_points = np.asarray(
            [point.xyz for point in self.map_manager.get_active_points(self.tracking_config.min_track_length)],
            dtype=np.float64,
        )
        if active_points.size > 0:
            export_pointcloud_ply(
                active_points,
                self.output_dirs["pointclouds"] / POINTCLOUD_FILE_NAME,
            )
        self._save_run_log(self.output_dirs["logs"] / "run_summary.csv")

    def _save_trajectory_text(self, output_path: Path) -> None:
        """Write camera poses to a text file."""
        with output_path.open("w", encoding="utf-8") as handle:
            for record in self.state.trajectory:
                flattened = record.pose_cw.reshape(-1)
                values = " ".join(f"{value:.6f}" for value in flattened)
                handle.write(f"{record.frame_id} {values}\n")

    def _save_run_log(self, output_path: Path) -> None:
        """Write per-frame diagnostics to a CSV file."""
        with output_path.open("w", encoding="utf-8") as handle:
            handle.write(
                "frame_id,mode,num_keypoints,num_matches,num_inliers,num_triangulated,mean_reprojection_error\n"
            )
            for record in self.state.frame_records:
                handle.write(
                    f"{record.frame_id},{record.mode},{record.num_keypoints},{record.num_matches},"
                    f"{record.num_inliers},{record.num_triangulated},{record.mean_reprojection_error}\n"
                )

    def _save_initialization_debug(
        self,
        result: InitializationResult,
        image_1: np.ndarray,
        image_2: np.ndarray,
    ) -> None:
        """Save a bootstrap match image for debugging."""
        first_features = self.detector.detect_and_compute(image_1)
        second_features = self.detector.detect_and_compute(image_2)
        matches = self.matcher.match(first_features.descriptors, second_features.descriptors)
        draw_feature_matches(
            image_a=image_1,
            keypoints_a=first_features.keypoints,
            image_b=image_2,
            keypoints_b=second_features.keypoints,
            matches=matches[: min(100, len(matches))],
            output_path=self.output_dirs["debug"]
            / f"bootstrap_{result.frame_idx_1:04d}_{result.frame_idx_2:04d}.png",
        )

    def _save_debug_reprojections(
        self,
        image_gray: np.ndarray,
        pose_cw: np.ndarray,
        correspondences: object,
        pnp_result: PnPResult,
        frame_id: int,
    ) -> None:
        """Save an image with inlier reprojections for debugging."""
        if pnp_result.inlier_indices is None or pnp_result.T_cw is None:
            return
        projected_points = project_points(
            self.camera.K,
            pose_cw,
            correspondences.points_3d[pnp_result.inlier_indices],
        )
        draw_reprojected_points(
            image_gray=image_gray,
            points_2d=projected_points,
            output_path=self.output_dirs["debug"] / f"reprojection_{frame_id:04d}.png",
        )

    def _feature_set_from_keyframe(self, keyframe: Keyframe) -> FeatureSet:
        """Create a feature-set view over a stored keyframe."""
        return FeatureSet(
            keypoints=[],
            descriptors=keyframe.descriptors,
        )

    @staticmethod
    def _empty_correspondences() -> object:
        """Return an empty correspondence-like object."""
        class _Empty:
            points_3d = np.empty((0, 3), dtype=np.float64)
            points_2d = np.empty((0, 2), dtype=np.float64)
            map_point_ids = np.empty((0,), dtype=np.int32)
            keypoint_indices = np.empty((0,), dtype=np.int32)
            matches: list = []

        return _Empty()
