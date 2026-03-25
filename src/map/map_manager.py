"""Management of sparse map points and keyframes."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from src.map.keyframe import Keyframe
from src.map.map_point import MapPoint


@dataclass(slots=True)
class MapStatistics:
    """Summary statistics for the current sparse map."""

    num_keyframes: int
    num_points: int
    num_valid_points: int


class MapManager:
    """Store and update sparse map points, keyframes, and observations."""

    def __init__(self) -> None:
        self.keyframes: dict[int, Keyframe] = {}
        self.map_points: dict[int, MapPoint] = {}
        self._next_keyframe_id = 0
        self._next_point_id = 0

    def create_keyframe(
        self,
        frame_id: int,
        image_path: str | None,
        pose_cw: np.ndarray,
        keypoints: np.ndarray,
        descriptors: np.ndarray | None,
    ) -> Keyframe:
        """Create and register a new keyframe."""
        keyframe = Keyframe(
            keyframe_id=self._next_keyframe_id,
            frame_id=frame_id,
            image_path=image_path,
            pose_cw=pose_cw.copy(),
            keypoints=keypoints,
            descriptors=None if descriptors is None else descriptors.copy(),
            map_point_ids=[None] * len(keypoints),
        )
        self.keyframes[keyframe.keyframe_id] = keyframe
        self._next_keyframe_id += 1
        return keyframe

    def add_map_points(
        self,
        points_3d: np.ndarray,
        descriptors: np.ndarray | None,
        keyframe_a: Keyframe,
        indices_a: np.ndarray,
        keyframe_b: Keyframe,
        indices_b: np.ndarray,
        reprojection_errors: np.ndarray | None = None,
    ) -> list[int]:
        """Insert new 3D map points and add observations in two keyframes."""
        created_ids: list[int] = []
        if descriptors is None:
            descriptors_iterable = [None] * len(points_3d)
        else:
            descriptors_iterable = descriptors

        for local_index, point_3d in enumerate(points_3d):
            descriptor = descriptors_iterable[local_index]
            point_id = self._next_point_id
            self._next_point_id += 1
            map_point = MapPoint(
                point_id=point_id,
                xyz=point_3d.copy(),
                descriptor=None if descriptor is None else descriptor.copy(),
                mean_reproj_error=0.0
                if reprojection_errors is None
                else float(reprojection_errors[local_index]),
            )
            keypoint_idx_a = int(indices_a[local_index])
            keypoint_idx_b = int(indices_b[local_index])
            map_point.add_observation(keyframe_a.keyframe_id, keypoint_idx_a)
            map_point.add_observation(keyframe_b.keyframe_id, keypoint_idx_b)
            keyframe_a.map_point_ids[keypoint_idx_a] = point_id
            keyframe_b.map_point_ids[keypoint_idx_b] = point_id
            self.map_points[point_id] = map_point
            created_ids.append(point_id)
        return created_ids

    def add_observation(
        self,
        point_id: int,
        keyframe: Keyframe,
        keypoint_idx: int,
    ) -> None:
        """Attach an existing map point to a keyframe observation."""
        map_point = self.map_points[point_id]
        keyframe.ensure_mapping_size()
        keyframe.map_point_ids[keypoint_idx] = point_id
        map_point.add_observation(keyframe.keyframe_id, keypoint_idx)

    def get_active_points(self, min_track_length: int = 1) -> list[MapPoint]:
        """Return currently valid map points with enough observations."""
        return [
            map_point
            for map_point in self.map_points.values()
            if map_point.is_valid and map_point.track_length >= min_track_length
        ]

    def get_keyframe(self, keyframe_id: int) -> Keyframe:
        """Fetch a keyframe by ID."""
        return self.keyframes[keyframe_id]

    def get_last_keyframe(self) -> Keyframe | None:
        """Return the most recently inserted keyframe."""
        if not self.keyframes:
            return None
        return self.keyframes[max(self.keyframes)]

    def update_map_point_errors(
        self,
        point_ids: np.ndarray,
        reprojection_errors: np.ndarray,
    ) -> None:
        """Update per-point reprojection diagnostics."""
        for point_id, error in zip(point_ids, reprojection_errors):
            map_point = self.map_points[int(point_id)]
            map_point.mean_reproj_error = float(error)

    def prune_invalid_points(
        self,
        max_reproj_error: float,
        min_track_length: int,
    ) -> None:
        """Mark map points invalid when they fail quality thresholds."""
        for map_point in self.map_points.values():
            if not np.isfinite(map_point.xyz).all():
                map_point.is_valid = False
                continue
            if map_point.track_length < min_track_length:
                map_point.is_valid = False
                continue
            if map_point.mean_reproj_error > max_reproj_error:
                map_point.is_valid = False

    def get_statistics(self) -> MapStatistics:
        """Return current map summary statistics."""
        valid_points = sum(1 for point in self.map_points.values() if point.is_valid)
        return MapStatistics(
            num_keyframes=len(self.keyframes),
            num_points=len(self.map_points),
            num_valid_points=valid_points,
        )
