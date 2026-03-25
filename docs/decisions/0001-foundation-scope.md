# ADR 0001: Keep the First Delivery Narrow

## Status
Accepted

## Context
The project needs a working monocular visual odometry foundation without collapsing into a large experimental script. Future phases will add triangulation, PnP, map points, keyframes, and bundle adjustment, but the first delivery only needs the base motion-estimation path.

## Decision
The current implementation includes:
- config loading
- camera intrinsics
- KITTI-style dataset access
- ORB and optional SIFT features
- brute-force matching with a ratio test
- essential-matrix pose recovery
- trajectory accumulation and logging

The current implementation excludes:
- triangulation
- PnP
- bundle adjustment
- keyframe logic
- evaluation tooling

## Consequences
- the codebase stays small and testable during early development
- interfaces remain open for later geometry and mapping work
- the current trajectory is useful for smoke validation, not for final benchmarking
