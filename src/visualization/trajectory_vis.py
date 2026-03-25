"""Trajectory visualization helpers."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

from src.geometry.transforms import camera_center_from_pose

CANVAS_SIZE = 800
CANVAS_MARGIN = 40


def save_trajectory_plot(poses_cw: list[np.ndarray], output_path: str | Path) -> Path:
    """Save a 2D top-down trajectory plot as a PNG."""
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not poses_cw:
        raise ValueError("At least one pose is required to plot a trajectory.")

    centers = np.asarray([camera_center_from_pose(pose) for pose in poses_cw], dtype=np.float64)
    trajectory_points = centers[:, [0, 2]]
    minimum = np.min(trajectory_points, axis=0)
    maximum = np.max(trajectory_points, axis=0)
    span = np.maximum(maximum - minimum, 1e-6)

    canvas = np.full((CANVAS_SIZE, CANVAS_SIZE, 3), 255, dtype=np.uint8)
    scaled_points = (trajectory_points - minimum) / span
    scaled_points = scaled_points * (CANVAS_SIZE - 2 * CANVAS_MARGIN) + CANVAS_MARGIN
    scaled_points = scaled_points.astype(np.int32)

    for start, end in zip(scaled_points[:-1], scaled_points[1:]):
        cv2.line(canvas, tuple(start), tuple(end), color=(40, 90, 200), thickness=2)
    for point in scaled_points:
        cv2.circle(canvas, tuple(point), radius=3, color=(0, 0, 0), thickness=-1)

    cv2.putText(
        canvas,
        "Estimated trajectory (x-z)",
        (20, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 0, 0),
        2,
        cv2.LINE_AA,
    )
    cv2.imwrite(str(path), canvas)
    return path
