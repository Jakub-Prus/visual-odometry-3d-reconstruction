# Architecture Overview

## Current scope
The repository currently implements the Phase 0-5 monocular VO foundation:
- typed configuration loading
- camera intrinsics handling
- KITTI-style grayscale dataset access
- local feature detection and descriptor matching
- essential-matrix relative pose estimation
- robust bootstrap initialization from a valid frame pair
- two-view triangulation and reprojection filtering
- sparse map management with keyframes and map points
- PnP-based tracking with essential-matrix fallback
- trajectory and sparse point-cloud export

## Runtime flow
1. [run_vo.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/scripts/run_vo.py) loads YAML config and resolves repo-relative paths.
2. [config.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/config.py) converts config data into nested dataclasses.
3. [kitti_dataset.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/dataset/kitti_dataset.py) exposes grayscale frames and a calibrated camera.
4. [detector.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/features/detector.py) extracts ORB or SIFT features.
5. [matcher.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/features/matcher.py) filters BFMatcher correspondences with a ratio test.
6. [initializer.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/pipeline/initializer.py) searches for a valid bootstrap pair and triangulates seed points.
7. [map_manager.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/map/map_manager.py) stores keyframes, map points, and observations.
8. [pnp.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/geometry/pnp.py) estimates later poses from 3D-2D correspondences.
9. [vo_pipeline.py](/c:/github/my-projects/visual-odometry-3d-reconstruction/src/pipeline/vo_pipeline.py) runs bootstrap and tracking modes, grows the map, and writes outputs.

## Module boundaries
- `src/config.py`: configuration schema and YAML loading
- `src/camera.py`: pinhole camera projection model
- `src/dataset/`: frame access and intrinsics ownership
- `src/features/`: detector and matcher wrappers
- `src/geometry/`: epipolar geometry, triangulation, reprojection, PnP, and rigid transforms
- `src/map/`: map-point, keyframe, and map-manager abstractions
- `src/pipeline/`: bootstrap, tracking, metrics, and trajectory state
- `src/visualization/`: trajectory, debug, and point-cloud outputs
- `src/utils/`: path and filesystem helpers

## Current constraints
- monocular only
- KITTI-style directory layout only
- no loop closure, relocalization, or bundle adjustment
- sparse map only
- monocular scale ambiguity and drift remain
