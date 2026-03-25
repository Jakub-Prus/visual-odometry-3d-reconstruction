"""CLI entry point for the monocular visual odometry foundation."""

from __future__ import annotations

import argparse
import logging
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

DEFAULT_MAX_FRAMES = 50


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--config",
        default="configs/default.yaml",
        help="Path to the YAML configuration file.",
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=DEFAULT_MAX_FRAMES,
        help="Maximum number of frames to process.",
    )
    return parser.parse_args()


def main() -> int:
    """Run the visual odometry pipeline from the command line."""
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
    args = parse_args()

    config_path = resolve_path(args.config, PROJECT_ROOT)
    config = load_config(config_path)

    dataset_path = resolve_path(config.dataset.path, PROJECT_ROOT)
    if config.dataset.type.lower() != "kitti":
        raise ValueError(f"Unsupported dataset type: {config.dataset.type}")

    dataset = KITTIDataset(
        root_dir=dataset_path,
        camera_config=config.camera,
        resize=config.dataset.resize,
    )
    detector = FeatureDetector(
        feature_type=config.features.type,
        nfeatures=config.features.nfeatures,
    )
    matcher = FeatureMatcher(
        feature_type=config.features.type,
        ratio_test=config.matching.ratio_test,
    )
    pipeline = VisualOdometryPipeline(
        dataset=dataset,
        detector=detector,
        matcher=matcher,
        geometry_config=config.geometry,
    )

    steps = pipeline.run(max_frames=args.max_frames)
    final_position = steps[-1].pose[:3, 3]
    logging.info("Processed %s frames.", len(steps))
    logging.info(
        "Final position estimate: [%.3f, %.3f, %.3f]",
        final_position[0],
        final_position[1],
        final_position[2],
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
