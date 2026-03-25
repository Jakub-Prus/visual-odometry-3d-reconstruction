# Use a Real KITTI Sequence

## Purpose
Point the current pipeline at a real KITTI-style image sequence.

## Directory expectation
The loader currently looks for images in one of these locations beneath the configured dataset root:
- `image_0/`
- `images/`
- the root directory itself

## Steps
1. Place the monocular image sequence in a local folder, for example `data/kitti_real/image_0`.
2. Copy [configs/default.yaml](/c:/github/my-projects/visual-odometry-3d-reconstruction/configs/default.yaml) or edit it in place.
3. Update:
- `dataset.path`
- `dataset.resize` if needed
- `camera.fx`, `camera.fy`, `camera.cx`, and `camera.cy` to match that sequence
4. Run:

```bash
python scripts/run_vo.py --config path/to/your_config.yaml --max-frames 50
```

## Notes
- the current loader does not parse KITTI calibration files automatically
- pose scale remains monocular and relative at this stage
- triangulation and evaluation are not implemented yet
