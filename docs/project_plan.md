# Project Plan

## Project description
Build a modular monocular visual odometry pipeline that estimates camera motion from an image sequence and prepares the codebase for sparse 3D reconstruction.

## Goals
- load KITTI-style image sequences with camera intrinsics
- detect and match local features
- estimate relative motion from the essential matrix
- accumulate a camera trajectory
- keep modules small, typed, and reusable for later reconstruction phases

## Architecture overview
- `configs/`: runtime configuration
- `scripts/`: CLI entry point
- `src/config.py`: YAML loading and typed config objects
- `src/camera.py`: pinhole camera model
- `src/dataset/`: dataset abstractions and KITTI loader
- `src/features/`: detector and matcher
- `src/geometry/`: essential matrix estimation and pose transforms
- `src/pipeline/`: visual odometry orchestration
- `src/utils/`: path and filesystem helpers

## Development phases
- Phase 0: Setup
  Environment, packaging, config, CLI, and repository layout.
- Phase 1: Dataset + Camera
  Dataset interface, KITTI loader, grayscale frames, and intrinsics handling.
- Phase 2: Features
  ORB/SIFT support, brute-force matching, and ratio-test filtering.
- Phase 3: Motion Estimation (future)
  Triangulation, PnP, keyframes, map maintenance, and evaluation.

## Deliverables
- runnable project skeleton
- default YAML config
- KITTI-style dataset loader
- feature extraction and matching modules
- essential-matrix pose estimation
- CLI pipeline that processes roughly 50 frames and logs trajectory updates

## Evaluation plan
- smoke-test the CLI on the bundled sample sequence
- verify feature counts, match counts, and inlier counts remain non-zero
- inspect accumulated translation updates for continuity
- extend later with KITTI/TUM trajectory metrics once ground-truth evaluation is added
