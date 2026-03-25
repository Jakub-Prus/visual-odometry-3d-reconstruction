"""Tests for PnP pose estimation."""

from __future__ import annotations

import unittest

import numpy as np

from src.geometry.pnp import estimate_pose_pnp
from src.geometry.reprojection import project_points
from src.geometry.transforms import pose_from_rt


class PnPTests(unittest.TestCase):
    """Verify approximate pose recovery from synthetic correspondences."""

    def test_estimate_pose_pnp(self) -> None:
        K = np.array([[300.0, 0.0, 160.0], [0.0, 300.0, 120.0], [0.0, 0.0, 1.0]])
        rotation = np.eye(3, dtype=np.float64)
        translation = np.array([0.1, -0.05, 0.2], dtype=np.float64)
        true_pose = pose_from_rt(rotation, translation)
        points_3d = np.array(
            [
                [-0.5, -0.2, 4.0],
                [0.3, -0.1, 5.0],
                [0.4, 0.4, 6.0],
                [-0.2, 0.5, 7.0],
                [0.1, 0.2, 8.0],
                [-0.4, 0.1, 5.5],
            ],
            dtype=np.float64,
        )
        points_2d = project_points(K, true_pose, points_3d)

        result = estimate_pose_pnp(
            points_3d=points_3d,
            points_2d=points_2d,
            K=K,
            reprojection_error=2.0,
            confidence=0.99,
            iterations_count=100,
        )

        self.assertTrue(result.success)
        self.assertGreaterEqual(result.num_inliers, 4)
        self.assertIsNotNone(result.T_cw)
        self.assertTrue(np.allclose(result.T_cw[:3, 3], translation, atol=1e-1))


if __name__ == "__main__":
    unittest.main()
