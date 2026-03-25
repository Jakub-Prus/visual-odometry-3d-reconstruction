"""Configuration loading utilities for the visual odometry project."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass(slots=True)
class DatasetConfig:
    """Dataset-related configuration."""

    type: str = "kitti"
    path: str = "data/kitti"
    resize: tuple[int, int] | None = None


@dataclass(slots=True)
class CameraConfig:
    """Camera intrinsics configuration."""

    fx: float = 718.856
    fy: float = 718.856
    cx: float = 607.1928
    cy: float = 185.2157


@dataclass(slots=True)
class FeaturesConfig:
    """Feature extraction configuration."""

    type: str = "orb"
    nfeatures: int = 2000


@dataclass(slots=True)
class MatchingConfig:
    """Descriptor matching configuration."""

    ratio_test: float = 0.75


@dataclass(slots=True)
class GeometryConfig:
    """Geometry estimation configuration."""

    ransac_threshold: float = 1.0
    confidence: float = 0.999


@dataclass(slots=True)
class InitializationConfig:
    """Bootstrap initialization configuration."""

    max_search_frames: int = 10
    min_matches: int = 120
    min_inliers: int = 80
    min_parallax_deg: float = 1.0
    max_reproj_error: float = 3.0


@dataclass(slots=True)
class TriangulationConfig:
    """Triangulation and filtering configuration."""

    min_depth: float = 0.1
    max_reproj_error: float = 3.0
    min_parallax_deg: float = 1.0


@dataclass(slots=True)
class TrackingConfig:
    """Multi-frame tracking configuration."""

    max_reproj_error: float = 4.0
    min_track_length: int = 2


@dataclass(slots=True)
class PnPConfig:
    """PnP pose estimation configuration."""

    enabled: bool = True
    reprojection_error: float = 4.0
    confidence: float = 0.99
    iterations_count: int = 100
    min_inliers: int = 30


@dataclass(slots=True)
class KeyframeConfig:
    """Keyframe insertion configuration."""

    min_translation: float = 0.15
    min_rotation_deg: float = 5.0
    min_tracked_points: int = 80


@dataclass(slots=True)
class AppConfig:
    """Application configuration with dot-notation access."""

    dataset: DatasetConfig = field(default_factory=DatasetConfig)
    camera: CameraConfig = field(default_factory=CameraConfig)
    features: FeaturesConfig = field(default_factory=FeaturesConfig)
    matching: MatchingConfig = field(default_factory=MatchingConfig)
    geometry: GeometryConfig = field(default_factory=GeometryConfig)
    initialization: InitializationConfig = field(default_factory=InitializationConfig)
    triangulation: TriangulationConfig = field(default_factory=TriangulationConfig)
    tracking: TrackingConfig = field(default_factory=TrackingConfig)
    pnp: PnPConfig = field(default_factory=PnPConfig)
    keyframe: KeyframeConfig = field(default_factory=KeyframeConfig)

    @classmethod
    def from_mapping(cls, mapping: dict[str, Any]) -> "AppConfig":
        """Create a strongly typed configuration object from a mapping."""
        dataset_data = mapping.get("dataset", {})
        resize_value = dataset_data.get("resize")
        resize = tuple(int(value) for value in resize_value) if resize_value else None

        return cls(
            dataset=DatasetConfig(
                type=str(dataset_data.get("type", "kitti")),
                path=str(dataset_data.get("path", "data/kitti")),
                resize=resize,
            ),
            camera=CameraConfig(**mapping.get("camera", {})),
            features=FeaturesConfig(**mapping.get("features", {})),
            matching=MatchingConfig(**mapping.get("matching", {})),
            geometry=GeometryConfig(**mapping.get("geometry", {})),
            initialization=InitializationConfig(**mapping.get("initialization", {})),
            triangulation=TriangulationConfig(**mapping.get("triangulation", {})),
            tracking=TrackingConfig(**mapping.get("tracking", {})),
            pnp=PnPConfig(**mapping.get("pnp", {})),
            keyframe=KeyframeConfig(**mapping.get("keyframe", {})),
        )


def load_config(config_path: str | Path) -> AppConfig:
    """Load a YAML configuration file into a typed configuration object."""
    path = Path(config_path)
    with path.open("r", encoding="utf-8") as handle:
        raw_config = yaml.safe_load(handle) or {}
    if not isinstance(raw_config, dict):
        raise ValueError(f"Configuration root must be a mapping: {path}")
    return AppConfig.from_mapping(raw_config)
