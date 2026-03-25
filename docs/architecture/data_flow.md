# Data Flow

## Inputs
- YAML config from [configs/default.yaml](/c:/github/my-projects/visual-odometry-3d-reconstruction/configs/default.yaml)
- ordered image sequence from `data/kitti/image_0` or another KITTI-like folder

## Per-frame processing
1. The dataset loader returns a `Frame` with grayscale pixels.
2. The detector produces keypoints and descriptors.
3. The matcher builds descriptor correspondences between the previous and current frame.
4. The pipeline extracts matched pixel coordinates.
5. Geometry estimation computes the essential matrix with RANSAC.
6. Pose recovery returns `R`, `t`, and an inlier mask.
7. Transform helpers convert `R` and `t` into a homogeneous pose and accumulate the trajectory.

## Outputs
- in-memory list of `TrajectoryStep` objects
- per-frame logs for keypoints, matches, inliers, and estimated position
- future-ready separation between measurement generation and motion estimation

## Design intent
The current flow is deliberately linear. Later phases can insert triangulation, map management, and PnP without changing the dataset or feature interfaces.
