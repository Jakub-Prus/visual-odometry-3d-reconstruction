"""Keyframe structures for sparse monocular mapping."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np


@dataclass(slots=True)
class Keyframe:
    """Stored keyframe with local descriptors and map associations."""

    keyframe_id: int
    frame_id: int
    image_path: str | None
    pose_cw: np.ndarray
    keypoints: np.ndarray
    descriptors: np.ndarray | None
    map_point_ids: list[int | None] = field(default_factory=list)

    def ensure_mapping_size(self) -> None:
        """Align the map-point index list with the number of keypoints."""
        missing_count = len(self.keypoints) - len(self.map_point_ids)
        if missing_count > 0:
            self.map_point_ids.extend([None] * missing_count)
