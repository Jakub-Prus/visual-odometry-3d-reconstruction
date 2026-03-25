"""Monocular visual odometry pipeline skeleton."""

from __future__ import annotations

import logging
from dataclasses import dataclass

import numpy as np

from src.config import GeometryConfig
from src.dataset.base_dataset import BaseDataset
from src.features.detector import FeatureDetector, FeatureSet
from src.features.matcher import FeatureMatcher
from src.geometry.essential import estimate_relative_pose
from src.geometry.transforms import compose_poses, invert_pose, pose_from_rt

LOGGER = logging.getLogger(__name__)
IDENTITY_POSE = np.eye(4, dtype=np.float64)
MIN_MATCH_COUNT = 8


@dataclass(slots=True)
class TrajectoryStep:
    """Trajectory sample and per-frame metrics."""

    frame_index: int
    pose: np.ndarray
    keypoint_count: int
    match_count: int
    inlier_count: int


class VisualOdometryPipeline:
    """Estimate a camera trajectory from a monocular image sequence."""

    def __init__(
        self,
        dataset: BaseDataset,
        detector: FeatureDetector,
        matcher: FeatureMatcher,
        geometry_config: GeometryConfig,
    ) -> None:
        self.dataset = dataset
        self.detector = detector
        self.matcher = matcher
        self.geometry_config = geometry_config
        self.camera = dataset.get_intrinsics()

    def run(self, max_frames: int = 50) -> list[TrajectoryStep]:
        """Run the VO loop and accumulate camera poses."""
        if len(self.dataset) < 2:
            raise ValueError("The dataset must contain at least two frames.")

        frame_count = min(max_frames, len(self.dataset))
        trajectory: list[TrajectoryStep] = []
        current_pose = IDENTITY_POSE.copy()

        previous_frame = self.dataset.get_frame(0)
        previous_features = self.detector.detect_and_compute(previous_frame.image_gray)
        trajectory.append(
            TrajectoryStep(
                frame_index=0,
                pose=current_pose.copy(),
                keypoint_count=len(previous_features.keypoints),
                match_count=0,
                inlier_count=0,
            )
        )

        for frame_index in range(1, frame_count):
            current_frame = self.dataset.get_frame(frame_index)
            current_features = self.detector.detect_and_compute(current_frame.image_gray)

            matches = self.matcher.match(
                previous_features.descriptors,
                current_features.descriptors,
            )

            if len(matches) < MIN_MATCH_COUNT:
                LOGGER.warning(
                    "Frame %s skipped: only %s matches available.",
                    frame_index,
                    len(matches),
                )
                trajectory.append(
                    TrajectoryStep(
                        frame_index=frame_index,
                        pose=current_pose.copy(),
                        keypoint_count=len(current_features.keypoints),
                        match_count=len(matches),
                        inlier_count=0,
                    )
                )
                previous_frame = current_frame
                previous_features = current_features
                continue

            points_previous, points_current = self._extract_matched_points(
                previous_features,
                current_features,
                matches,
            )

            try:
                pose_result = estimate_relative_pose(
                    points_a=points_previous,
                    points_b=points_current,
                    camera=self.camera,
                    ransac_threshold=self.geometry_config.ransac_threshold,
                    confidence=self.geometry_config.confidence,
                )
                relative_pose = pose_from_rt(pose_result.rotation, pose_result.translation)
                current_pose = compose_poses(current_pose, invert_pose(relative_pose))
                inlier_count = pose_result.num_inliers
            except ValueError as error:
                LOGGER.warning("Frame %s pose estimation failed: %s", frame_index, error)
                inlier_count = 0

            trajectory.append(
                TrajectoryStep(
                    frame_index=frame_index,
                    pose=current_pose.copy(),
                    keypoint_count=len(current_features.keypoints),
                    match_count=len(matches),
                    inlier_count=inlier_count,
                )
            )
            position = current_pose[:3, 3]
            LOGGER.info(
                "Frame %s | kp=%s matches=%s inliers=%s position=[%.3f, %.3f, %.3f]",
                frame_index,
                len(current_features.keypoints),
                len(matches),
                inlier_count,
                position[0],
                position[1],
                position[2],
            )

            previous_frame = current_frame
            previous_features = current_features

        return trajectory

    @staticmethod
    def _extract_matched_points(
        previous_features: FeatureSet,
        current_features: FeatureSet,
        matches: list,
    ) -> tuple[np.ndarray, np.ndarray]:
        """Extract point coordinates from matched keypoints."""
        previous_points = np.array(
            [previous_features.keypoints[match.queryIdx].pt for match in matches],
            dtype=np.float64,
        )
        current_points = np.array(
            [current_features.keypoints[match.trainIdx].pt for match in matches],
            dtype=np.float64,
        )
        return previous_points, current_points
