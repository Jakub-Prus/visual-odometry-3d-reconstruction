"""Tests for initialization and essential-geometry integration."""

from __future__ import annotations

import unittest
from pathlib import Path

import numpy as np

from src.camera import Camera
from src.config import load_config
from src.dataset.kitti_dataset import KITTIDataset
from src.features.detector import FeatureDetector
from src.features.matcher import FeatureMatcher
from src.geometry.essential import estimate_relative_pose
from src.pipeline.initializer import MonocularInitializer


class InitializerTests(unittest.TestCase):
    """Verify bootstrap initialization behavior on synthetic and bundled data."""

    def test_estimate_relative_pose_returns_valid_shapes(self) -> None:
        camera = Camera.from_parameters(300.0, 300.0, 160.0, 120.0, 320, 240)
        points_3d = np.array(
            [
                [-0.5, -0.2, 5.0],
                [0.4, -0.3, 6.0],
                [0.3, 0.5, 7.0],
                [-0.1, 0.2, 4.5],
                [0.2, -0.1, 8.0],
                [-0.4, 0.4, 6.5],
                [0.1, 0.1, 5.5],
                [-0.2, -0.4, 7.5],
            ],
            dtype=np.float64,
        )
        points_a = camera.project(points_3d)
        translated_points = points_3d + np.array([-0.2, 0.0, 0.0], dtype=np.float64)
        points_b = camera.project(translated_points)

        result = estimate_relative_pose(points_a, points_b, camera)

        self.assertEqual(result.rotation.shape, (3, 3))
        self.assertEqual(result.translation.shape, (3,))
        self.assertEqual(result.inlier_mask.shape, (len(points_3d),))
        self.assertGreater(result.num_inliers, 0)

    def test_initializer_bootstraps_on_bundled_sequence(self) -> None:
        config = load_config(Path("configs/mapping.yaml"))
        dataset = KITTIDataset(Path(config.dataset.path), config.camera, config.dataset.resize)
        detector = FeatureDetector(config.features.type, config.features.nfeatures)
        matcher = FeatureMatcher(config.features.type, config.matching.ratio_test)
        initializer = MonocularInitializer(
            dataset=dataset,
            detector=detector,
            matcher=matcher,
            geometry_config=config.geometry,
            initialization_config=config.initialization,
            triangulation_config=config.triangulation,
        )

        result = initializer.try_initialize()

        self.assertTrue(result.success)
        self.assertIsNotNone(result.points_3d)
        self.assertGreater(len(result.points_3d), 0)
        self.assertGreaterEqual(result.frame_idx_1, 0)
        self.assertGreater(result.frame_idx_2, result.frame_idx_1)
        self.assertGreater(result.mean_parallax_deg, 0.0)


if __name__ == "__main__":
    unittest.main()
