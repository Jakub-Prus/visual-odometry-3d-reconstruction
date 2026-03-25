# Monocular Visual Odometry and Sparse 3D Reconstruction

This repository contains a modular Python foundation for monocular visual odometry on image sequences such as KITTI and TUM. The current implementation covers Phase 0-2: configuration, camera and dataset handling, feature extraction and matching, essential-matrix motion estimation, and a runnable VO pipeline skeleton.

## Setup

1. Create and activate a Python 3.10+ environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

```bash
python scripts/run_vo.py --config configs/default.yaml
```

The default config targets `data/kitti`. This repository includes a small synthetic KITTI-like sequence so the pipeline can run immediately and process the first 50 frames.

## Current progress

- Phase 0: repo structure, config system, packaging, and CLI
- Phase 1: dataset abstraction, KITTI-style loader, and camera model
- Phase 2: ORB and optional SIFT detection, brute-force matching, and ratio test
- Motion estimation foundation: essential matrix estimation, pose recovery, and trajectory accumulation

## Planned features

- sparse triangulation and map points
- PnP-based tracking against 3D structure
- keyframe management
- bundle adjustment
- visualization and quantitative evaluation
