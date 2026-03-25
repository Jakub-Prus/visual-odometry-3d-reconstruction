"""Tests for configuration loading and camera projection."""

from __future__ import annotations

import unittest
from pathlib import Path

import numpy as np

from src.camera import Camera
from src.config import load_config


class ConfigCameraTests(unittest.TestCase):
    """Verify typed configuration loading and camera projection behavior."""

    def test_load_config_mapping_file(self) -> None:
        config = load_config(Path("configs/mapping.yaml"))
        self.assertEqual(config.dataset.type, "kitti")
        self.assertEqual(config.dataset.resize, (640, 480))
        self.assertTrue(config.pnp.enabled)
        self.assertEqual(config.keyframe.min_tracked_points, 80)

    def test_camera_project_returns_expected_pixels(self) -> None:
        camera = Camera.from_parameters(
            fx=200.0,
            fy=200.0,
            cx=100.0,
            cy=80.0,
            width=320,
            height=240,
        )
        points_3d = np.array([[0.0, 0.0, 2.0], [1.0, 0.5, 4.0]], dtype=np.float64)
        projected = camera.project(points_3d)
        expected = np.array([[100.0, 80.0], [150.0, 105.0]], dtype=np.float64)
        self.assertTrue(np.allclose(projected, expected))

    def test_camera_project_rejects_non_positive_depth(self) -> None:
        camera = Camera.from_parameters(200.0, 200.0, 100.0, 80.0, 320, 240)
        with self.assertRaises(ValueError):
            camera.project(np.array([[0.0, 0.0, 0.0]], dtype=np.float64))


if __name__ == "__main__":
    unittest.main()
