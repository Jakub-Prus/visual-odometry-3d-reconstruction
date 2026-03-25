# Dataset and Config Domain Notes

## Config model
The runtime config is split into five sections:
- `dataset`
- `camera`
- `features`
- `matching`
- `geometry`

These are loaded into nested dataclasses so downstream modules receive typed values instead of raw dictionaries.

## Dataset assumptions
- the current loader targets KITTI-like folders
- supported image roots are `image_0/`, `images/`, or the dataset root
- images are loaded in grayscale and sorted lexicographically
- optional resizing rescales intrinsics to preserve pixel geometry

## Local sample sequence
The repository ships with a small synthetic KITTI-like sequence under `data/kitti/image_0`. It exists only to keep the default CLI path runnable and smoke-testable without downloading external data.

## Open gaps
- no TUM loader yet
- no calibration-file parsing yet
- no timestamp handling yet
- no train/validation split or benchmarking harness yet
