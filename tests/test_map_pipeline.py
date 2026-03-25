"""Tests for map management and pipeline smoke behavior."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import numpy as np

from src.config import load_config
from src.dataset.kitti_dataset import KITTIDataset
from src.features.detector import FeatureDetector
from src.features.matcher import FeatureMatcher
from src.map.map_manager import MapManager
from src.pipeline.vo_pipeline import VisualOdometryPipeline


class MapPipelineTests(unittest.TestCase):
    """Verify map bookkeeping and a real pipeline smoke run."""

    def test_map_manager_adds_and_prunes_points(self) -> None:
        manager = MapManager()
        pose = np.eye(4, dtype=np.float64)
        keypoints = np.array([[10.0, 10.0], [20.0, 20.0]], dtype=np.float64)
        descriptors = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.uint8)
        keyframe_a = manager.create_keyframe(0, "a.png", pose, keypoints, descriptors)
        keyframe_b = manager.create_keyframe(1, "b.png", pose, keypoints, descriptors)

        point_ids = manager.add_map_points(
            points_3d=np.array([[1.0, 0.0, 5.0], [2.0, 0.0, 5.0]], dtype=np.float64),
            descriptors=descriptors,
            keyframe_a=keyframe_a,
            indices_a=np.array([0, 1], dtype=np.int32),
            keyframe_b=keyframe_b,
            indices_b=np.array([0, 1], dtype=np.int32),
            reprojection_errors=np.array([0.5, 10.0], dtype=np.float64),
        )

        self.assertEqual(len(point_ids), 2)
        self.assertEqual(manager.get_statistics().num_valid_points, 2)

        manager.prune_invalid_points(max_reproj_error=2.0, min_track_length=2)

        active_points = manager.get_active_points(min_track_length=2)
        self.assertEqual(len(active_points), 1)
        self.assertEqual(active_points[0].point_id, point_ids[0])

    def test_pipeline_smoke_run_writes_outputs(self) -> None:
        config = load_config(Path("configs/mapping.yaml"))
        dataset = KITTIDataset(Path(config.dataset.path), config.camera, config.dataset.resize)
        detector = FeatureDetector(config.features.type, config.features.nfeatures)
        matcher = FeatureMatcher(config.features.type, config.matching.ratio_test)

        with tempfile.TemporaryDirectory() as temp_dir:
            pipeline = VisualOdometryPipeline(
                dataset=dataset,
                detector=detector,
                matcher=matcher,
                geometry_config=config.geometry,
                initialization_config=config.initialization,
                triangulation_config=config.triangulation,
                tracking_config=config.tracking,
                pnp_config=config.pnp,
                keyframe_config=config.keyframe,
                output_root=temp_dir,
            )

            state = pipeline.run(max_frames=12)

            self.assertTrue(state.initialized)
            self.assertGreaterEqual(len(state.frame_records), 2)
            self.assertGreater(len(pipeline.map_manager.keyframes), 1)
            self.assertGreater(pipeline.map_manager.get_statistics().num_valid_points, 0)

            temp_path = Path(temp_dir)
            self.assertTrue((temp_path / "trajectories" / "trajectory.txt").exists())
            self.assertTrue((temp_path / "trajectories" / "trajectory.png").exists())
            self.assertTrue((temp_path / "logs" / "run_summary.csv").exists())
            self.assertTrue((temp_path / "pointclouds" / "sparse_map.ply").exists())


if __name__ == "__main__":
    unittest.main()
