"""Debug visualization helpers for image-space diagnostics."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np


def _to_color(image_gray: np.ndarray) -> np.ndarray:
    """Convert a grayscale image to BGR for annotation."""
    if image_gray.ndim == 2:
        return cv2.cvtColor(image_gray, cv2.COLOR_GRAY2BGR)
    return image_gray.copy()


def draw_feature_matches(
    image_a: np.ndarray,
    keypoints_a: list[cv2.KeyPoint],
    image_b: np.ndarray,
    keypoints_b: list[cv2.KeyPoint],
    matches: list[cv2.DMatch],
    output_path: str | Path,
) -> Path:
    """Draw and save feature matches between two frames."""
    match_image = cv2.drawMatches(
        _to_color(image_a),
        keypoints_a,
        _to_color(image_b),
        keypoints_b,
        matches,
        None,
    )
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), match_image)
    return path


def draw_reprojected_points(
    image_gray: np.ndarray,
    points_2d: np.ndarray,
    output_path: str | Path,
) -> Path:
    """Overlay projected points on an image and save the result."""
    canvas = _to_color(image_gray)
    for point in points_2d.astype(int):
        cv2.circle(canvas, tuple(point), radius=2, color=(0, 255, 0), thickness=-1)
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), canvas)
    return path
