"""Tracking helpers for keyframes and map correspondences."""

from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np

from src.features.detector import FeatureSet
from src.features.matcher import FeatureMatcher
from src.map.keyframe import Keyframe
from src.map.map_manager import MapManager


@dataclass(slots=True)
class CorrespondenceSet:
    """2D-3D correspondences between a frame and the map."""

    points_3d: np.ndarray
    points_2d: np.ndarray
    map_point_ids: np.ndarray
    keypoint_indices: np.ndarray
    matches: list[cv2.DMatch]


def match_frame_to_keyframe(
    matcher: FeatureMatcher,
    frame_features: FeatureSet,
    keyframe: Keyframe,
) -> list[cv2.DMatch]:
    """Match the current frame descriptors to a stored keyframe."""
    return matcher.match(frame_features.descriptors, keyframe.descriptors)


def build_2d3d_correspondences(
    matches: list[cv2.DMatch],
    frame_features: FeatureSet,
    keyframe: Keyframe,
    map_manager: MapManager,
) -> CorrespondenceSet:
    """Build 3D-2D correspondences from keyframe matches and map associations."""
    points_3d: list[np.ndarray] = []
    points_2d: list[np.ndarray] = []
    map_point_ids: list[int] = []
    keypoint_indices: list[int] = []
    kept_matches: list[cv2.DMatch] = []

    for match in matches:
        keyframe_point_id = keyframe.map_point_ids[match.trainIdx]
        if keyframe_point_id is None:
            continue
        map_point = map_manager.map_points.get(keyframe_point_id)
        if map_point is None or not map_point.is_valid:
            continue
        points_3d.append(map_point.xyz)
        points_2d.append(frame_features.keypoints[match.queryIdx].pt)
        map_point_ids.append(keyframe_point_id)
        keypoint_indices.append(match.queryIdx)
        kept_matches.append(match)

    return CorrespondenceSet(
        points_3d=np.asarray(points_3d, dtype=np.float64).reshape(-1, 3),
        points_2d=np.asarray(points_2d, dtype=np.float64).reshape(-1, 2),
        map_point_ids=np.asarray(map_point_ids, dtype=np.int32),
        keypoint_indices=np.asarray(keypoint_indices, dtype=np.int32),
        matches=kept_matches,
    )


def select_active_map_points(
    map_manager: MapManager,
    min_track_length: int,
) -> list[int]:
    """Return IDs for active map points with sufficient support."""
    return [point.point_id for point in map_manager.get_active_points(min_track_length)]
