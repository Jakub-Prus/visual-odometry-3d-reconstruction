# VO Pipeline Domain Notes

## Main entities
- `Frame`: grayscale image plus frame index and source path
- `Camera`: intrinsic matrix and image size
- `FeatureSet`: keypoints and descriptors for one frame
- `PoseRecoveryResult`: essential matrix, rotation, translation, and inliers
- `TrajectoryStep`: accumulated pose and per-frame metrics

## Pipeline invariants
- all geometry operates on grayscale images
- the dataset owns the calibrated `Camera`
- pose accumulation uses 4x4 homogeneous transforms
- at least 8 filtered matches are required before attempting motion estimation
- the pipeline keeps the previous pose when estimation fails

## Metrics that matter now
- keypoint count per frame
- filtered match count between frames
- inlier count after essential-matrix estimation and pose recovery
- accumulated translation from the current pose

## Near-term extensions
- triangulated landmarks from inlier correspondences
- PnP against persistent 3D points
- trajectory export for evaluation
- visualization hooks for matches and path overlays
