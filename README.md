# Monocular Visual Odometry and Sparse 3D Reconstruction

This repository contains a modular Python project for monocular visual odometry with sparse 3D reconstruction. The current implementation now covers bootstrap initialization, two-view triangulation, lightweight mapping with keyframes and map points, PnP-based tracking, reprojection filtering, point-cloud export, and trajectory/debug outputs.

It also now includes a portfolio-focused web UI under `frontend/` built with Next.js, React, TypeScript, Tailwind CSS, and demo/mock data for public deployment.

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

## Results-first web UI

The web application lives in `frontend/` and is now organized around a results-first flow:

1. launch a run from the UI
2. watch progress through initialization, tracking, triangulation, and finalizing
3. open a completed result
4. see trajectory, sparse map, key metrics, and visual artifacts first
5. inspect linked image evidence for selected 3D points
6. browse the sequence and technical details only if needed

The UI supports two modes:

- `demo`: bundled mock data, static assets, and simulated run progress for portfolio/public demo use
- `api`: future backend integration through isolated adapters

### Run frontend locally

```bash
cd frontend
npm install
NEXT_PUBLIC_APP_MODE=demo npm run dev
```

Then open `http://localhost:3000`.

### Demo mode behavior

- `Home` spotlights the latest successful result
- `New Run` lets you choose a demo dataset and start a mocked processing run
- `Results` shows the run gallery and completed outputs
- each result page leads with trajectory, sparse point cloud, and quality summary
- result pages now support point-to-image correspondence inspection
- `Sequence` lets you browse the input frames with linked point highlights
- `Correspondences` lets you inspect a selected 3D point and its supporting image observations

### Future API mode

```bash
cd frontend
NEXT_PUBLIC_APP_MODE=api NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 npm run dev
```

Planned API-backed flow:
- `POST /api/runs`
- `GET /api/runs/:id/progress`
- `GET /api/results`
- `GET /api/results/:id`

### UI screenshots

- home and recent-result spotlight placeholder
- new run and progress view placeholder
- main result page with trajectory + sparse map placeholder
- sequence browser and linked observation placeholder

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

## Visual verification in the web UI

The frontend now supports a result-to-input verification flow:

- select a sparse 3D point in the map view
- inspect linked observations and reprojection stats
- open the sequence browser to see where that point appears in the input images
- click a highlighted image observation and keep the 3D point selection synchronized
- use the correspondence split view to judge whether the reconstruction aligns with visible image structure

## Planned features

- bundle adjustment
- quantitative trajectory evaluation
- improved data association across a broader active map
- richer API-backed UI integration and live run playback

## Current limitations

- monocular scale remains ambiguous
- drift accumulates over time
- no loop closure or relocalization
- sparse map only
- no bundle adjustment yet
