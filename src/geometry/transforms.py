"""Rigid transform helpers for SE(3) camera poses."""

from __future__ import annotations

import numpy as np

POSE_DIMENSION = 4
ROTATION_DIMENSION = 3


def pose_from_rt(rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    """Create a homogeneous 4x4 pose matrix from rotation and translation."""
    if rotation.shape != (ROTATION_DIMENSION, ROTATION_DIMENSION):
        raise ValueError("rotation must have shape (3, 3).")
    if translation.shape != (ROTATION_DIMENSION,):
        raise ValueError("translation must have shape (3,).")

    pose = np.eye(POSE_DIMENSION, dtype=np.float64)
    pose[:ROTATION_DIMENSION, :ROTATION_DIMENSION] = rotation
    pose[:ROTATION_DIMENSION, 3] = translation
    return pose


def compose_poses(left_pose: np.ndarray, right_pose: np.ndarray) -> np.ndarray:
    """Compose two homogeneous poses."""
    return left_pose @ right_pose


def invert_pose(pose: np.ndarray) -> np.ndarray:
    """Invert a homogeneous 4x4 pose."""
    rotation = pose[:ROTATION_DIMENSION, :ROTATION_DIMENSION]
    translation = pose[:ROTATION_DIMENSION, 3]
    inverted_pose = np.eye(POSE_DIMENSION, dtype=np.float64)
    inverted_pose[:ROTATION_DIMENSION, :ROTATION_DIMENSION] = rotation.T
    inverted_pose[:ROTATION_DIMENSION, 3] = -rotation.T @ translation
    return inverted_pose


def transform_points(pose_cw: np.ndarray, points_3d: np.ndarray) -> np.ndarray:
    """Transform world-frame points into the camera frame."""
    if points_3d.ndim != 2 or points_3d.shape[1] != ROTATION_DIMENSION:
        raise ValueError("points_3d must have shape (N, 3).")
    rotation = pose_cw[:ROTATION_DIMENSION, :ROTATION_DIMENSION]
    translation = pose_cw[:ROTATION_DIMENSION, 3]
    return points_3d @ rotation.T + translation


def camera_center_from_pose(pose_cw: np.ndarray) -> np.ndarray:
    """Return the camera center in world coordinates from a world-to-camera pose."""
    rotation = pose_cw[:ROTATION_DIMENSION, :ROTATION_DIMENSION]
    translation = pose_cw[:ROTATION_DIMENSION, 3]
    return -rotation.T @ translation


def rotation_angle_degrees(relative_rotation: np.ndarray) -> float:
    """Compute the rotation angle in degrees from a relative rotation matrix."""
    trace_value = np.trace(relative_rotation)
    cosine = float(np.clip((trace_value - 1.0) * 0.5, -1.0, 1.0))
    return float(np.degrees(np.arccos(cosine)))
