"""Structured state containers for the visual odometry pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np


@dataclass(slots=True)
class FrameRecord:
    """Per-frame diagnostic record."""

    frame_id: int
    image_path: str | None
    pose_cw: np.ndarray | None = None
    num_keypoints: int = 0
    num_matches: int = 0
    num_inliers: int = 0
    num_triangulated: int = 0
    mode: str = "bootstrap"
    mean_reprojection_error: float = 0.0


@dataclass(slots=True)
class TrajectoryRecord:
    """Pose sample stored for trajectory output."""

    frame_id: int
    pose_cw: np.ndarray


@dataclass(slots=True)
class PipelineState:
    """Mutable VO pipeline state."""

    initialized: bool = False
    current_frame_id: int = -1
    last_keyframe_id: int | None = None
    current_pose_cw: np.ndarray | None = None
    frame_records: list[FrameRecord] = field(default_factory=list)
    trajectory: list[TrajectoryRecord] = field(default_factory=list)
    sparse_points: list[np.ndarray] = field(default_factory=list)

    def add_frame_record(self, record: FrameRecord) -> None:
        """Append a frame record and update frame counters."""
        self.current_frame_id = record.frame_id
        self.frame_records.append(record)
        if record.pose_cw is not None:
            self.current_pose_cw = record.pose_cw
            self.trajectory.append(TrajectoryRecord(record.frame_id, record.pose_cw.copy()))
