"""Essential matrix estimation and relative pose recovery."""

from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np

from src.camera import Camera

MIN_ESSENTIAL_POINTS = 5


@dataclass(slots=True)
class PoseRecoveryResult:
    """Output of essential matrix pose recovery."""

    essential_matrix: np.ndarray
    rotation: np.ndarray
    translation: np.ndarray
    inlier_mask: np.ndarray

    @property
    def num_inliers(self) -> int:
        """Return the number of inlier correspondences."""
        return int(np.count_nonzero(self.inlier_mask))


def estimate_essential_matrix(
    points_a: np.ndarray,
    points_b: np.ndarray,
    camera: Camera,
    ransac_threshold: float = 1.0,
    confidence: float = 0.999,
) -> tuple[np.ndarray, np.ndarray]:
    """Estimate the essential matrix from 2D point correspondences."""
    if len(points_a) < MIN_ESSENTIAL_POINTS or len(points_b) < MIN_ESSENTIAL_POINTS:
        raise ValueError("At least five point correspondences are required.")

    essential_matrix, mask = cv2.findEssentialMat(
        points_a,
        points_b,
        cameraMatrix=camera.K,
        method=cv2.RANSAC,
        prob=confidence,
        threshold=ransac_threshold,
    )
    if essential_matrix is None or mask is None:
        raise ValueError("Essential matrix estimation failed.")
    if essential_matrix.shape[0] > 3:
        essential_matrix = essential_matrix[:3, :]
    return essential_matrix, mask.ravel().astype(bool)


def recover_pose(
    essential_matrix: np.ndarray,
    points_a: np.ndarray,
    points_b: np.ndarray,
    camera: Camera,
    inlier_mask: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Recover relative rotation and translation from the essential matrix."""
    pose_mask = None
    if inlier_mask is not None:
        pose_mask = inlier_mask.astype(np.uint8).reshape(-1, 1)

    _, rotation, translation, recovered_mask = cv2.recoverPose(
        essential_matrix,
        points_a,
        points_b,
        cameraMatrix=camera.K,
        mask=pose_mask,
    )
    recovered_inliers = recovered_mask.ravel().astype(bool)
    if np.count_nonzero(recovered_inliers) == 0 and inlier_mask is not None:
        recovered_inliers = inlier_mask.astype(bool)
    return rotation, translation.reshape(3), recovered_inliers


def estimate_relative_pose(
    points_a: np.ndarray,
    points_b: np.ndarray,
    camera: Camera,
    ransac_threshold: float = 1.0,
    confidence: float = 0.999,
) -> PoseRecoveryResult:
    """Estimate the essential matrix and recover the relative camera pose."""
    essential_matrix, inlier_mask = estimate_essential_matrix(
        points_a=points_a,
        points_b=points_b,
        camera=camera,
        ransac_threshold=ransac_threshold,
        confidence=confidence,
    )
    rotation, translation, pose_mask = recover_pose(
        essential_matrix=essential_matrix,
        points_a=points_a,
        points_b=points_b,
        camera=camera,
        inlier_mask=inlier_mask,
    )
    return PoseRecoveryResult(
        essential_matrix=essential_matrix,
        rotation=rotation,
        translation=translation,
        inlier_mask=pose_mask,
    )
