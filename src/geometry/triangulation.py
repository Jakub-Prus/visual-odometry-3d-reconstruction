"""Two-view triangulation helpers."""

from __future__ import annotations

import cv2
import numpy as np

from src.geometry.reprojection import compute_reprojection_errors
from src.geometry.transforms import camera_center_from_pose, transform_points

MIN_HOMOGENEOUS_ROWS = 4


def build_projection_matrix(K: np.ndarray, T_cw: np.ndarray) -> np.ndarray:
    """Build a 3x4 projection matrix from intrinsics and a world-to-camera pose."""
    return K @ T_cw[:3, :]


def homogeneous_to_euclidean(points_h: np.ndarray) -> np.ndarray:
    """Convert homogeneous coordinates into Euclidean coordinates."""
    if points_h.ndim != 2:
        raise ValueError("points_h must be a 2D array.")
    if points_h.shape[0] == MIN_HOMOGENEOUS_ROWS:
        homogeneous = points_h.T
    elif points_h.shape[1] == MIN_HOMOGENEOUS_ROWS:
        homogeneous = points_h
    else:
        raise ValueError("points_h must have a homogeneous dimension of 4.")
    scales = homogeneous[:, -1:]
    return homogeneous[:, :-1] / scales


def triangulate_points(
    P1: np.ndarray,
    P2: np.ndarray,
    pts1: np.ndarray,
    pts2: np.ndarray,
) -> np.ndarray:
    """Triangulate 3D points from two-view correspondences."""
    points_h = cv2.triangulatePoints(P1, P2, pts1.T, pts2.T)
    return homogeneous_to_euclidean(points_h)


def compute_parallax_angles(
    points_3d: np.ndarray,
    T1_cw: np.ndarray,
    T2_cw: np.ndarray,
) -> np.ndarray:
    """Compute the triangulation parallax angle for each point in degrees."""
    center_1 = camera_center_from_pose(T1_cw)
    center_2 = camera_center_from_pose(T2_cw)
    rays_1 = points_3d - center_1
    rays_2 = points_3d - center_2
    norms_1 = np.linalg.norm(rays_1, axis=1)
    norms_2 = np.linalg.norm(rays_2, axis=1)
    dot_products = np.sum(rays_1 * rays_2, axis=1)
    cosine_values = dot_products / np.clip(norms_1 * norms_2, 1e-12, None)
    cosine_values = np.clip(cosine_values, -1.0, 1.0)
    return np.degrees(np.arccos(cosine_values))


def filter_triangulated_points(
    points_3d: np.ndarray,
    K: np.ndarray,
    T1_cw: np.ndarray,
    T2_cw: np.ndarray,
    pts1: np.ndarray,
    pts2: np.ndarray,
    max_reproj_error: float,
    min_parallax_deg: float,
    min_depth: float = 0.1,
) -> tuple[np.ndarray, np.ndarray]:
    """Filter triangulated points using depth, finiteness, reprojection, and parallax."""
    finite_mask = np.isfinite(points_3d).all(axis=1)
    points_cam_1 = transform_points(T1_cw, points_3d)
    points_cam_2 = transform_points(T2_cw, points_3d)
    positive_depth_mask = (points_cam_1[:, 2] > min_depth) & (points_cam_2[:, 2] > min_depth)

    errors_1 = compute_reprojection_errors(K, T1_cw, points_3d, pts1)
    errors_2 = compute_reprojection_errors(K, T2_cw, points_3d, pts2)
    reprojection_mask = (errors_1 <= max_reproj_error) & (errors_2 <= max_reproj_error)

    parallax_angles = compute_parallax_angles(points_3d, T1_cw, T2_cw)
    parallax_mask = parallax_angles >= min_parallax_deg

    valid_mask = finite_mask & positive_depth_mask & reprojection_mask & parallax_mask
    return points_3d[valid_mask], valid_mask
