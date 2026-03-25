"""Camera models and projection helpers."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


INTRINSIC_MATRIX_SHAPE = (3, 3)
POINT_DIMENSION = 3


@dataclass(slots=True, frozen=True)
class Camera:
    """Pinhole camera model."""

    K: np.ndarray
    width: int
    height: int

    def __post_init__(self) -> None:
        """Validate the camera intrinsics shape."""
        if self.K.shape != INTRINSIC_MATRIX_SHAPE:
            raise ValueError(f"Camera matrix must have shape {INTRINSIC_MATRIX_SHAPE}.")

    @classmethod
    def from_parameters(
        cls,
        fx: float,
        fy: float,
        cx: float,
        cy: float,
        width: int,
        height: int,
    ) -> "Camera":
        """Build a camera from scalar intrinsics."""
        intrinsic_matrix = np.array(
            [[fx, 0.0, cx], [0.0, fy, cy], [0.0, 0.0, 1.0]],
            dtype=np.float64,
        )
        return cls(K=intrinsic_matrix, width=width, height=height)

    def project(self, points_3d: np.ndarray) -> np.ndarray:
        """Project 3D points in camera coordinates into image pixels."""
        if points_3d.ndim != 2 or points_3d.shape[1] != POINT_DIMENSION:
            raise ValueError("points_3d must have shape (N, 3).")
        depths = points_3d[:, 2:3]
        if np.any(depths <= 0.0):
            raise ValueError("All points must have positive depth for projection.")
        normalized_points = points_3d / depths
        image_points = normalized_points @ self.K.T
        return image_points[:, :2]
