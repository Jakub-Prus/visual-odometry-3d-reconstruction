"""Tests for triangulation helpers."""

from __future__ import annotations

import unittest

import numpy as np

from src.geometry.triangulation import (
    build_projection_matrix,
    filter_triangulated_points,
    homogeneous_to_euclidean,
    triangulate_points,
)


class TriangulationTests(unittest.TestCase):
    """Verify basic triangulation behavior."""

    def setUp(self) -> None:
        self.K = np.array([[200.0, 0.0, 100.0], [0.0, 200.0, 100.0], [0.0, 0.0, 1.0]])
        self.T1 = np.eye(4, dtype=np.float64)
        self.T2 = np.eye(4, dtype=np.float64)
        self.T2[0, 3] = -0.5
        self.points_3d = np.array(
            [[0.2, 0.1, 4.0], [0.0, -0.2, 5.0], [0.3, 0.4, 6.0]],
            dtype=np.float64,
        )
        self.pts1 = np.array([[110.0, 105.0], [100.0, 92.0], [110.0, 113.33333333]])
        self.pts2 = np.array([[85.0, 105.0], [80.0, 92.0], [93.33333333, 113.33333333]])

    def test_homogeneous_to_euclidean_shape(self) -> None:
        points_h = np.array(
            [[2.0, 4.0], [4.0, 6.0], [6.0, 8.0], [2.0, 2.0]],
            dtype=np.float64,
        )
        points = homogeneous_to_euclidean(points_h)
        self.assertEqual(points.shape, (2, 3))

    def test_triangulate_points_shape(self) -> None:
        P1 = build_projection_matrix(self.K, self.T1)
        P2 = build_projection_matrix(self.K, self.T2)
        triangulated = triangulate_points(P1, P2, self.pts1, self.pts2)
        self.assertEqual(triangulated.shape, (3, 3))

    def test_filter_mask_shape(self) -> None:
        filtered_points, valid_mask = filter_triangulated_points(
            points_3d=self.points_3d,
            K=self.K,
            T1_cw=self.T1,
            T2_cw=self.T2,
            pts1=self.pts1,
            pts2=self.pts2,
            max_reproj_error=1.0,
            min_parallax_deg=0.1,
        )
        self.assertEqual(valid_mask.dtype, np.bool_)
        self.assertEqual(valid_mask.shape, (3,))
        self.assertEqual(filtered_points.shape[1], 3)


if __name__ == "__main__":
    unittest.main()
