"""Tests for rigid transform helpers."""

from __future__ import annotations

import unittest

import numpy as np

from src.geometry.transforms import invert_pose, pose_from_rt


class TransformTests(unittest.TestCase):
    """Validate SE(3) pose helper behavior."""

    def test_pose_inverse_round_trip(self) -> None:
        rotation = np.eye(3, dtype=np.float64)
        translation = np.array([1.0, -2.0, 0.5], dtype=np.float64)
        pose = pose_from_rt(rotation, translation)
        inverse = invert_pose(pose)
        identity = inverse @ pose
        self.assertTrue(np.allclose(identity, np.eye(4)))


if __name__ == "__main__":
    unittest.main()
