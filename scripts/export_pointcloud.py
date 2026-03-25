"""Export the sparse point cloud produced by the VO pipeline."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.config import load_config
from src.dataset.kitti_dataset import KITTIDataset
from src.features.detector import FeatureDetector
from src.features.matcher import FeatureMatcher
from src.pipeline.vo_pipeline import VisualOdometryPipeline
from src.utils.io import resolve_path
from src.visualization.pointcloud_vis import export_pointcloud_ply


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default="configs/mapping.yaml", help="Path to the YAML configuration file.")
    parser.add_argument("--max-frames", type=int, default=20, help="Maximum number of frames to process.")
    parser.add_argument(
        "--output",
        default="outputs/pointclouds/exported_sparse_map.ply",
        help="Path to the exported PLY file.",
    )
    return parser.parse_args()


def main() -> int:
    """Run the pipeline and export the current sparse point cloud."""
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
    args = parse_args()

    config = load_config(resolve_path(args.config, PROJECT_ROOT))
    dataset = KITTIDataset(resolve_path(config.dataset.path, PROJECT_ROOT), config.camera, config.dataset.resize)
    detector = FeatureDetector(config.features.type, config.features.nfeatures)
    matcher = FeatureMatcher(config.features.type, config.matching.ratio_test)
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
        output_root=PROJECT_ROOT / "outputs",
    )
    pipeline.run(max_frames=args.max_frames)
    points = np.asarray(
        [point.xyz for point in pipeline.map_manager.get_active_points(config.tracking.min_track_length)],
        dtype=np.float64,
    )
    output_path = export_pointcloud_ply(points, resolve_path(args.output, PROJECT_ROOT))
    logging.info("Exported %s points to %s", len(points), output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
