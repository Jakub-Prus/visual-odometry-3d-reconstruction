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
