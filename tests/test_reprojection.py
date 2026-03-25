"""Tests for reprojection helpers."""

from __future__ import annotations

import unittest

import numpy as np

from src.geometry.reprojection import compute_reprojection_errors, project_points


class ReprojectionTests(unittest.TestCase):
    """Validate projection and reprojection error computations."""

    def test_projection_shape(self) -> None:
        K = np.array([[200.0, 0.0, 100.0], [0.0, 200.0, 100.0], [0.0, 0.0, 1.0]])
        T_cw = np.eye(4, dtype=np.float64)
        points_3d = np.array([[0.0, 0.0, 5.0], [1.0, 2.0, 10.0]], dtype=np.float64)
        projected = project_points(K, T_cw, points_3d)
        self.assertEqual(projected.shape, (2, 2))

    def test_reprojection_error_near_zero(self) -> None:
        K = np.array([[200.0, 0.0, 100.0], [0.0, 200.0, 100.0], [0.0, 0.0, 1.0]])
        T_cw = np.eye(4, dtype=np.float64)
        points_3d = np.array([[0.0, 0.0, 5.0], [1.0, 2.0, 10.0]], dtype=np.float64)
        points_2d = project_points(K, T_cw, points_3d)
        errors = compute_reprojection_errors(K, T_cw, points_3d, points_2d)
        self.assertTrue(np.all(errors < 1e-6))


if __name__ == "__main__":
    unittest.main()
