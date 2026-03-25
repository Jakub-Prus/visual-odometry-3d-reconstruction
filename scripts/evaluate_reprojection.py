"""Evaluate reprojection statistics for a short VO run."""

from __future__ import annotations

import argparse
import logging
import statistics
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.config import load_config
from src.dataset.kitti_dataset import KITTIDataset
from src.features.detector import FeatureDetector
from src.features.matcher import FeatureMatcher
from src.pipeline.vo_pipeline import VisualOdometryPipeline
from src.utils.io import resolve_path


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default="configs/mapping.yaml", help="Path to the YAML configuration file.")
    parser.add_argument("--max-frames", type=int, default=20, help="Maximum number of frames to process.")
    return parser.parse_args()


def main() -> int:
    """Run a short sequence and print reprojection statistics."""
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

    valid_points = pipeline.map_manager.get_active_points(config.tracking.min_track_length)
    errors = [point.mean_reproj_error for point in valid_points if point.is_valid and point.mean_reproj_error > 0.0]
    mean_error = float("inf") if not errors else statistics.fmean(errors)
    median_error = float("inf") if not errors else statistics.median(errors)
    stats = pipeline.map_manager.get_statistics()

    print(f"mean_reprojection_error: {mean_error:.4f}")
    print(f"median_reprojection_error: {median_error:.4f}")
    print(f"valid_map_points: {stats.num_valid_points}")
    print(f"keyframes: {stats.num_keyframes}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
