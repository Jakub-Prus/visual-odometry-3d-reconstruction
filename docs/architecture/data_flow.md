# Data Flow

## Inputs
- YAML config from [configs/default.yaml](/c:/github/my-projects/visual-odometry-3d-reconstruction/configs/default.yaml)
- ordered image sequence from `data/kitti/image_0` or another KITTI-like folder

## Per-frame processing
1. The dataset loader returns a `Frame` with grayscale pixels.
2. The detector produces keypoints and descriptors.
3. During bootstrap, the initializer scans early frame pairs and estimates an essential matrix.
4. Inlier correspondences are triangulated into seed 3D points and inserted into the map with two initial keyframes.
5. During tracking, the current frame matches against the latest keyframe and builds 3D-2D correspondences.
6. PnP estimates the current pose; if that fails, the pipeline falls back to frame-to-frame essential-matrix motion.
7. If the frame becomes a keyframe, the pipeline triangulates additional points with the previous keyframe and updates map observations.
8. Outputs are written as trajectory plots, text trajectories, point clouds, and debug images.

## Outputs
- pipeline state with frame and trajectory records
- per-frame logs for bootstrap, tracking, inliers, and map growth
- `outputs/trajectories` artifacts
- `outputs/pointclouds` artifacts
- `outputs/debug` visual diagnostics

## Design intent
The current flow is deliberately modular. Later phases can add bundle adjustment, broader active-map selection, and evaluation tooling without rewriting the dataset, feature, or map interfaces.
