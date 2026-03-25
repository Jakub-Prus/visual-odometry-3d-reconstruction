# Project Plan

## Project description
Build a modular monocular visual odometry pipeline that estimates camera motion from an image sequence, initializes from a valid baseline, reconstructs a sparse map, and keeps tracking through lightweight local mapping.

## Goals
- load KITTI-style image sequences with camera intrinsics
- detect and match local features
- estimate relative motion from the essential matrix
- triangulate sparse 3D points from valid two-view baselines
- accumulate a camera trajectory
- track later poses with PnP from 3D-2D correspondences
- keep modules small, typed, and reusable for later reconstruction phases

## Architecture overview
- `configs/`: runtime configuration
- `scripts/`: CLI entry point
- `src/config.py`: YAML loading and typed config objects
- `src/camera.py`: pinhole camera model
- `src/dataset/`: dataset abstractions and KITTI loader
- `src/features/`: detector and matcher
- `src/geometry/`: essential matrix estimation, triangulation, reprojection, PnP, and pose transforms
- `src/map/`: map points, keyframes, and map management
- `src/pipeline/`: bootstrap initialization, runtime state, and visual odometry orchestration
- `src/visualization/`: trajectory, debug, and point-cloud outputs
- `src/utils/`: path and filesystem helpers

## Development phases
- Phase 0: Setup
  Environment, packaging, config, CLI, and repository layout.
- Phase 1: Dataset + Camera
  Dataset interface, KITTI loader, grayscale frames, and intrinsics handling.
- Phase 2: Features
  ORB/SIFT support, brute-force matching, and ratio-test filtering.
- Phase 3: Triangulation and bootstrap
  Two-view initialization, projection matrices, triangulation, and reprojection filtering.
- Phase 4: Mapping
  Keyframes, map points, observation storage, and local map growth.
- Phase 5: PnP tracking
  3D-2D correspondences, RANSAC PnP, fallback motion estimation, and debug outputs.

## Deliverables
- runnable project skeleton
- default YAML config
- KITTI-style dataset loader
- feature extraction and matching modules
- essential-matrix pose estimation
- triangulation and reprojection utilities
- lightweight map manager with keyframes and map points
- CLI pipeline that bootstraps, tracks, and writes outputs

## Evaluation plan
- smoke-test the CLI on the bundled sample sequence
- verify initialization finds a valid frame pair
- verify feature counts, match counts, inlier counts, and tracked map points remain non-zero
- inspect accumulated translation updates and saved outputs for continuity
- extend later with KITTI/TUM trajectory metrics once ground-truth evaluation is added
