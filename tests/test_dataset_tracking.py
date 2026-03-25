"""Tests for dataset loading and tracking correspondences."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import cv2
import numpy as np

from src.config import CameraConfig
from src.dataset.kitti_dataset import KITTIDataset
from src.features.detector import FeatureSet
from src.features.tracking import build_2d3d_correspondences
from src.map.map_manager import MapManager


class DatasetTrackingTests(unittest.TestCase):
    """Verify dataset resizing and 3D-2D correspondence construction."""

    def test_kitti_dataset_resizes_images_and_intrinsics(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            image_dir = Path(temp_dir) / "image_0"
            image_dir.mkdir(parents=True, exist_ok=True)
            image = np.full((20, 40), 128, dtype=np.uint8)
            cv2.imwrite(str(image_dir / "000000.png"), image)
            cv2.imwrite(str(image_dir / "000001.png"), image)

            dataset = KITTIDataset(
                root_dir=temp_dir,
                camera_config=CameraConfig(fx=100.0, fy=120.0, cx=20.0, cy=10.0),
                resize=(20, 10),
            )

            frame = dataset.get_frame(0)
            camera = dataset.get_intrinsics()
            self.assertEqual(frame.image_gray.shape, (10, 20))
            self.assertAlmostEqual(camera.K[0, 0], 50.0)
            self.assertAlmostEqual(camera.K[1, 1], 60.0)
            self.assertAlmostEqual(camera.K[0, 2], 10.0)
            self.assertAlmostEqual(camera.K[1, 2], 5.0)

    def test_build_2d3d_correspondences_filters_unmapped_points(self) -> None:
        manager = MapManager()
        pose = np.eye(4, dtype=np.float64)
        keypoints = np.array([[10.0, 10.0], [20.0, 20.0], [30.0, 30.0]], dtype=np.float64)
        descriptors = np.array([[1, 1, 1], [2, 2, 2], [3, 3, 3]], dtype=np.uint8)
        keyframe_a = manager.create_keyframe(0, "a.png", pose, keypoints, descriptors)
        keyframe_b = manager.create_keyframe(1, "b.png", pose, keypoints, descriptors)
        point_ids = manager.add_map_points(
            points_3d=np.array([[0.0, 0.0, 4.0], [1.0, 0.0, 5.0]], dtype=np.float64),
            descriptors=descriptors[:2],
            keyframe_a=keyframe_a,
            indices_a=np.array([0, 1], dtype=np.int32),
            keyframe_b=keyframe_b,
            indices_b=np.array([0, 1], dtype=np.int32),
        )

        feature_set = FeatureSet(
            keypoints=[
                cv2.KeyPoint(x=11.0, y=11.0, size=1.0),
                cv2.KeyPoint(x=21.0, y=21.0, size=1.0),
                cv2.KeyPoint(x=31.0, y=31.0, size=1.0),
            ],
            descriptors=descriptors,
        )
        matches = [
            cv2.DMatch(_queryIdx=0, _trainIdx=0, _distance=0.1),
            cv2.DMatch(_queryIdx=1, _trainIdx=1, _distance=0.1),
            cv2.DMatch(_queryIdx=2, _trainIdx=2, _distance=0.1),
        ]

        correspondences = build_2d3d_correspondences(matches, feature_set, keyframe_b, manager)

        self.assertEqual(correspondences.points_3d.shape, (2, 3))
        self.assertEqual(correspondences.points_2d.shape, (2, 2))
        self.assertTrue(np.array_equal(correspondences.map_point_ids, np.array(point_ids, dtype=np.int32)))
        self.assertTrue(np.array_equal(correspondences.keypoint_indices, np.array([0, 1], dtype=np.int32)))


if __name__ == "__main__":
    unittest.main()
