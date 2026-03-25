# Phase 4: Mapping

## Why map points and keyframes are needed
Pure pairwise visual odometry cannot support PnP tracking because it does not retain stable 3D structure. This phase introduces `MapPoint` and `Keyframe` abstractions so later frames can match against an accumulated sparse map instead of relying only on consecutive frame motion.

## Observation storage
Each `MapPoint` stores:
- a unique ID
- 3D position
- optional representative descriptor
- a list of `(keyframe_id, keypoint_idx)` observations
- reprojection diagnostics and validity state

Each `Keyframe` stores:
- frame ID and pose
- 2D keypoint coordinates
- descriptors
- map-point IDs aligned with keypoint indices

This makes it possible to recover 3D-2D correspondences for PnP and to add new observations when a point is re-seen.

## Keyframe insertion logic
The pipeline inserts a keyframe when any of these happen:
- translation from the previous keyframe exceeds the configured threshold
- rotation exceeds the configured threshold
- the tracked point count drops below the configured minimum

When a new keyframe is inserted, the pipeline tries to:
- attach tracked map points as new observations
- triangulate new points with the previous keyframe
- prune invalid points using reprojection and track-length thresholds

## What this system does not do yet
- loop closure
- global optimization
- bundle adjustment
- relocalization
- dense mapping
