"""Sparse point-cloud export and optional visualization utilities."""

from __future__ import annotations

from pathlib import Path

import numpy as np


def export_pointcloud_ply(points_3d: np.ndarray, output_path: str | Path) -> Path:
    """Export a sparse point cloud to an ASCII PLY file."""
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    points = points_3d[np.isfinite(points_3d).all(axis=1)]

    with path.open("w", encoding="utf-8") as handle:
        handle.write("ply\n")
        handle.write("format ascii 1.0\n")
        handle.write(f"element vertex {len(points)}\n")
        handle.write("property float x\n")
        handle.write("property float y\n")
        handle.write("property float z\n")
        handle.write("end_header\n")
        for point in points:
            handle.write(f"{point[0]} {point[1]} {point[2]}\n")
    return path


def show_pointcloud(points_3d: np.ndarray) -> None:
    """Display a sparse point cloud using Open3D when available."""
    try:
        import open3d as o3d
    except ImportError as error:
        raise RuntimeError("Open3D is not installed in the active environment.") from error

    point_cloud = o3d.geometry.PointCloud()
    point_cloud.points = o3d.utility.Vector3dVector(points_3d)
    o3d.visualization.draw_geometries([point_cloud])
