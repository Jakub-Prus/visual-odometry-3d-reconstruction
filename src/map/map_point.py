"""Map point structures for sparse reconstruction."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np


@dataclass(slots=True)
class MapPoint:
    """Sparse 3D map point with observation metadata."""

    point_id: int
    xyz: np.ndarray
    descriptor: np.ndarray | None = None
    observations: list[tuple[int, int]] = field(default_factory=list)
    mean_reproj_error: float = 0.0
    track_length: int = 0
    is_valid: bool = True

    def add_observation(self, keyframe_id: int, keypoint_idx: int) -> None:
        """Record a keyframe observation for this map point."""
        observation = (keyframe_id, keypoint_idx)
        if observation not in self.observations:
            self.observations.append(observation)
            self.track_length = len(self.observations)
