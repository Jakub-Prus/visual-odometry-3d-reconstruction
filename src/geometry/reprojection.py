"""Projection and reprojection error utilities."""

from __future__ import annotations

import numpy as np

from src.geometry.transforms import transform_points


def project_points(K: np.ndarray, T_cw: np.ndarray, points_3d: np.ndarray) -> np.ndarray:
    """Project world-frame 3D points into image coordinates."""
    points_camera = transform_points(T_cw, points_3d)
    depths = points_camera[:, 2:3]
    normalized = points_camera / depths
    image_points = normalized @ K.T
    return image_points[:, :2]


def compute_reprojection_errors(
    K: np.ndarray,
    T_cw: np.ndarray,
    points_3d: np.ndarray,
    points_2d: np.ndarray,
) -> np.ndarray:
    """Compute per-point reprojection errors in pixels."""
    projected_points = project_points(K, T_cw, points_3d)
    errors = np.linalg.norm(projected_points - points_2d, axis=1)
    points_camera = transform_points(T_cw, points_3d)
    invalid_mask = ~np.isfinite(points_3d).all(axis=1) | (points_camera[:, 2] <= 0.0)
    errors[invalid_mask] = np.inf
    return errors


def compute_mean_reprojection_error(
    K: np.ndarray,
    T_cw: np.ndarray,
    points_3d: np.ndarray,
    points_2d: np.ndarray,
) -> float:
    """Compute the mean finite reprojection error."""
    errors = compute_reprojection_errors(K, T_cw, points_3d, points_2d)
    finite_errors = errors[np.isfinite(errors)]
    if finite_errors.size == 0:
        return float("inf")
    return float(np.mean(finite_errors))
