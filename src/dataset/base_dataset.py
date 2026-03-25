"""Dataset abstractions for monocular visual odometry."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path

import numpy as np

from src.camera import Camera


@dataclass(slots=True)
class Frame:
    """Single dataset frame."""

    index: int
    image_gray: np.ndarray
    path: Path


class BaseDataset(ABC):
    """Abstract interface for frame-based monocular datasets."""

    @abstractmethod
    def __len__(self) -> int:
        """Return the number of frames in the dataset."""

    @abstractmethod
    def get_frame(self, idx: int) -> Frame:
        """Return the frame at the provided index."""

    @abstractmethod
    def get_intrinsics(self) -> Camera:
        """Return the camera intrinsics for the dataset."""

    def __getitem__(self, idx: int) -> Frame:
        """Allow index-based access with dataset[idx]."""
        return self.get_frame(idx)
