# VO Pipeline Domain Notes

## Main entities
- `Frame`: grayscale image plus frame index and source path
- `Camera`: intrinsic matrix and image size
- `FeatureSet`: keypoints and descriptors for one frame
- `PoseRecoveryResult`: essential matrix, rotation, translation, and inliers
- `InitializationResult`: bootstrap pair, seed points, and diagnostics
- `FrameRecord` / `PipelineState`: runtime state and trajectory bookkeeping
- `Keyframe` and `MapPoint`: persistent sparse map structures

## Pipeline invariants
- all geometry operates on grayscale images
- the dataset owns the calibrated `Camera`
- pose accumulation uses 4x4 homogeneous transforms
- initialization must find a valid pair before tracking starts
- triangulation only uses inlier correspondences
- PnP only runs when enough 3D-2D correspondences exist
- the pipeline falls back to essential-matrix motion when PnP is weak

## Metrics that matter now
- keypoint count per frame
- filtered match count between frames
- inlier count after essential-matrix estimation and pose recovery
- accumulated translation from the current pose

## Near-term extensions
- stronger active-map selection beyond the latest keyframe
- local optimization / bundle adjustment
- trajectory export for formal evaluation
- richer debug and inspection tooling
