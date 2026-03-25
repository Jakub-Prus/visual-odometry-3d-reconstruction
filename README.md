# Monocular Visual Odometry and Sparse 3D Reconstruction

This repository contains a modular Python project for monocular visual odometry with sparse 3D reconstruction. The current implementation now covers bootstrap initialization, two-view triangulation, lightweight mapping with keyframes and map points, PnP-based tracking, reprojection filtering, point-cloud export, and trajectory/debug outputs.

## Setup

1. Create the local virtual environment:

```bash
python -m venv .venv
```

2. Activate it in Bash:

```bash
source .venv/Scripts/activate
```

3. Install dependencies inside the virtual environment:

```bash
pip install -r requirements.txt
```

## Run

```bash
python scripts/run_vo.py --config configs/default.yaml
```

The default config targets `data/kitti`. This repository includes a small synthetic KITTI-like sequence so the pipeline can run immediately and process the first 50 frames.

## Additional utilities

```bash
python scripts/export_pointcloud.py --config configs/mapping.yaml --max-frames 20
python scripts/evaluate_reprojection.py --config configs/mapping.yaml --max-frames 20
```

## Current progress

- Phase 0: repo structure, config system, packaging, and CLI
- Phase 1: dataset abstraction, KITTI-style loader, and camera model
- Phase 2: ORB and optional SIFT detection, brute-force matching, and ratio test
- Phase 3: robust bootstrap from a good frame pair with seed-map triangulation
- Phase 4: lightweight mapping with `MapPoint`, `Keyframe`, and local map management
- Phase 5: PnP-based tracking, reprojection filtering, trajectory plotting, and sparse point-cloud export

## Current pipeline behavior

1. Search early frame pairs for a valid bootstrap pair.
2. Recover a relative pose and triangulate seed map points.
3. Insert initial keyframes and map points.
4. Track later frames with 3D-2D correspondences and PnP when possible.
5. Fall back to essential-matrix motion if PnP is weak.
6. Insert new keyframes, triangulate new points, and prune weak map points.
7. Save trajectory and point-cloud outputs under `outputs/`.

## Planned features

- bundle adjustment
- quantitative trajectory evaluation
- improved data association across a broader active map
- visualization and quantitative evaluation

## Current limitations

- monocular scale remains ambiguous
- drift accumulates over time
- no loop closure or relocalization
- sparse map only
- no bundle adjustment yet
