"""PnP-based pose estimation helpers."""

from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np

from src.geometry.reprojection import compute_mean_reprojection_error
from src.geometry.transforms import pose_from_rt

MIN_PNP_POINTS = 4


@dataclass(slots=True)
class PnPResult:
    """Result of PnP pose estimation."""

    success: bool
    T_cw: np.ndarray | None
    inlier_indices: np.ndarray | None
    num_inliers: int
    mean_reproj_error: float


def estimate_pose_pnp(
    points_3d: np.ndarray,
    points_2d: np.ndarray,
    K: np.ndarray,
    reprojection_error: float,
    confidence: float,
    iterations_count: int,
) -> PnPResult:
    """Estimate a camera pose from 3D-2D correspondences using RANSAC."""
    if len(points_3d) < MIN_PNP_POINTS or len(points_2d) < MIN_PNP_POINTS:
        return PnPResult(False, None, None, 0, float("inf"))

    success, rvec, tvec, inliers = cv2.solvePnPRansac(
        objectPoints=points_3d.astype(np.float64),
        imagePoints=points_2d.astype(np.float64),
        cameraMatrix=K,
        distCoeffs=None,
        reprojectionError=reprojection_error,
        confidence=confidence,
        iterationsCount=iterations_count,
        flags=cv2.SOLVEPNP_EPNP,
    )
    if not success or inliers is None:
        return PnPResult(False, None, None, 0, float("inf"))

    inlier_indices = inliers.ravel()
    refined_pose = refine_pose_pnp(points_3d[inlier_indices], points_2d[inlier_indices], K, rvec, tvec)
    if refined_pose is None:
        return PnPResult(False, None, None, 0, float("inf"))

    mean_error = compute_mean_reprojection_error(
        K,
        refined_pose,
        points_3d[inlier_indices],
        points_2d[inlier_indices],
    )
    return PnPResult(
        success=True,
        T_cw=refined_pose,
        inlier_indices=inlier_indices,
        num_inliers=int(inlier_indices.size),
        mean_reproj_error=mean_error,
    )


def refine_pose_pnp(
    points_3d: np.ndarray,
    points_2d: np.ndarray,
    K: np.ndarray,
    initial_rvec: np.ndarray,
    initial_tvec: np.ndarray,
) -> np.ndarray | None:
    """Refine a PnP pose estimate with iterative optimization."""
    success, refined_rvec, refined_tvec = cv2.solvePnP(
        objectPoints=points_3d.astype(np.float64),
        imagePoints=points_2d.astype(np.float64),
        cameraMatrix=K,
        distCoeffs=None,
        rvec=initial_rvec,
        tvec=initial_tvec,
        useExtrinsicGuess=True,
        flags=cv2.SOLVEPNP_ITERATIVE,
    )
    if not success:
        return None
    rotation, _ = cv2.Rodrigues(refined_rvec)
    translation = refined_tvec.reshape(3)
    return pose_from_rt(rotation, translation)
