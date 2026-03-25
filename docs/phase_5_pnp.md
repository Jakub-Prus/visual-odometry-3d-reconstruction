# Phase 5: PnP Tracking

## Why PnP matters
Once a sparse map exists, later poses should be estimated from 3D map points to current 2D image observations. This is more structurally meaningful than chaining only relative frame-to-frame motion and is the bridge from simple VO toward mapping-aware localization.

## 3D-2D correspondence flow
The current pipeline:
1. matches the current frame against the latest keyframe
2. keeps only matches whose keyframe keypoints already reference valid map points
3. builds a `points_3d ↔ points_2d` correspondence set
4. runs `solvePnPRansac`

## RANSAC in PnP
RANSAC protects pose estimation from bad correspondences by searching for a pose supported by a strong inlier subset. The pipeline rejects weak PnP results when inlier support falls below the configured threshold.

## Fallback logic
If PnP cannot recover a stable pose, the pipeline falls back to essential-matrix motion against the previous frame. This keeps the sequence moving while still preferring map-based localization when enough 3D-2D support exists.

## Reprojection-based filtering
After PnP succeeds, reprojection errors are computed for inlier map points and stored in the map. The map manager can then prune points that:
- project behind the camera
- have high reprojection error
- have too few observations
- contain invalid coordinates

## Outputs
- per-frame tracking diagnostics
- trajectory plot and text export
- sparse point-cloud export
- debug overlays for initialization matches and reprojected points
