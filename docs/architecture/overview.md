# Architecture Overview

## Current scope
The repository currently implements the Phase 0-2 foundation for monocular visual odometry:
- typed configuration loading
- camera intrinsics handling
- KITTI-style grayscale dataset access
- local feature detection and descriptor matching
- essential-matrix relative pose estimation
- trajectory accumulation through a small pipeline orchestration layer

## Runtime flow
1. [run_vo.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/scripts/run_vo.py) loads YAML config and resolves repo-relative paths.
2. [config.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/config.py) converts config data into nested dataclasses.
3. [kitti_dataset.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/dataset/kitti_dataset.py) exposes grayscale frames and a calibrated camera.
4. [detector.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/features/detector.py) extracts ORB or SIFT features.
5. [matcher.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/features/matcher.py) filters BFMatcher correspondences with a ratio test.
6. [essential.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/geometry/essential.py) estimates the essential matrix and recovers relative pose.
7. [vo_pipeline.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/pipeline/vo_pipeline.py) accumulates SE(3) poses and logs metrics.

## Module boundaries
- `src/config.py`: configuration schema and YAML loading
- `src/camera.py`: pinhole camera projection model
- `src/dataset/`: frame access and intrinsics ownership
- `src/features/`: detector and matcher wrappers
- `src/geometry/`: epipolar geometry and rigid transforms
- `src/pipeline/`: orchestration, metrics, and trajectory state
- `src/utils/`: path and filesystem helpers

## Current constraints
- monocular only
- KITTI-style directory layout only
- no triangulation, PnP, bundle adjustment, or keyframes yet
- logging only; visualization and metrics export are still future work
