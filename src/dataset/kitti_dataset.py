"""KITTI-style image sequence dataset loader."""

from __future__ import annotations

from pathlib import Path

import cv2

from src.camera import Camera
from src.config import CameraConfig
from src.dataset.base_dataset import BaseDataset, Frame

IMAGE_DIRECTORIES = ("image_0", "images", "")
IMAGE_SUFFIXES = ("*.png", "*.jpg", "*.jpeg", "*.bmp", "*.pgm")


class KITTIDataset(BaseDataset):
    """Minimal KITTI-like dataset loader for monocular sequences."""

    def __init__(
        self,
        root_dir: str | Path,
        camera_config: CameraConfig,
        resize: tuple[int, int] | None = None,
    ) -> None:
        self.root_dir = Path(root_dir)
        self.resize = resize
        self.image_paths = self._discover_images(self.root_dir)
        if not self.image_paths:
            raise FileNotFoundError(f"No images found in dataset path: {self.root_dir}")
        self.camera = self._build_camera(camera_config)

    def __len__(self) -> int:
        """Return the number of images in the sequence."""
        return len(self.image_paths)

    def get_frame(self, idx: int) -> Frame:
        """Load a grayscale frame by index."""
        image_path = self.image_paths[idx]
        image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
        if image is None:
            raise FileNotFoundError(f"Unable to read image: {image_path}")
        if self.resize is not None:
            image = cv2.resize(image, self.resize, interpolation=cv2.INTER_LINEAR)
        return Frame(index=idx, image_gray=image, path=image_path)

    def get_intrinsics(self) -> Camera:
        """Return the dataset camera intrinsics."""
        return self.camera

    @classmethod
    def _discover_images(cls, root_dir: Path) -> list[Path]:
        """Find a supported image sequence inside a KITTI-style directory."""
        for subdirectory in IMAGE_DIRECTORIES:
            candidate_dir = root_dir / subdirectory if subdirectory else root_dir
            if not candidate_dir.exists():
                continue
            image_paths: list[Path] = []
            for suffix in IMAGE_SUFFIXES:
                image_paths.extend(sorted(candidate_dir.glob(suffix)))
            if image_paths:
                return sorted(image_paths)
        return []

    def _build_camera(self, camera_config: CameraConfig) -> Camera:
        """Create a camera and scale intrinsics when resized."""
        sample_image = cv2.imread(str(self.image_paths[0]), cv2.IMREAD_GRAYSCALE)
        if sample_image is None:
            raise FileNotFoundError(f"Unable to read image: {self.image_paths[0]}")
        original_height, original_width = sample_image.shape[:2]
        target_width, target_height = self.resize or (original_width, original_height)

        scale_x = float(target_width) / float(original_width)
        scale_y = float(target_height) / float(original_height)

        return Camera.from_parameters(
            fx=camera_config.fx * scale_x,
            fy=camera_config.fy * scale_y,
            cx=camera_config.cx * scale_x,
            cy=camera_config.cy * scale_y,
            width=target_width,
            height=target_height,
        )
