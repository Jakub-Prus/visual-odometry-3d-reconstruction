# Run Local Pipeline

## Purpose
Run the current VO foundation locally and confirm the basic path still works.

## Steps
1. Create a Python 3.10+ environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Run:

```bash
python scripts/run_vo.py --config configs/default.yaml
```

## Expected result
- the script processes up to 50 frames by default
- logs include keypoint, match, inlier, and position updates
- the command exits with code `0`

## If it fails
- confirm `data/kitti/image_0` contains readable images
- confirm OpenCV and PyYAML are installed in the active environment
- confirm the config path is correct and repo-relative
- rerun `python -m compileall src scripts` to catch syntax issues first
