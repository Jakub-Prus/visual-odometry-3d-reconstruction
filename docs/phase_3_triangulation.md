# Phase 3: Triangulation

## Two-view triangulation
After the initializer finds a valid frame pair, the project builds two projection matrices from camera intrinsics and world-to-camera poses, then triangulates only inlier correspondences from the essential-matrix stage. This keeps reconstruction tied to geometrically consistent matches instead of raw descriptor matches.

## Projection matrix construction
For each camera pose `T_cw`, the projection matrix is:

```text
P = K [R | t]
```

where `K` is the 3x3 intrinsic matrix and `T_cw[:3, :]` provides the extrinsic block.

## Filtering rules
Triangulated points are filtered by:
- finite Euclidean coordinates
- positive depth in both cameras
- maximum reprojection error
- minimum triangulation angle / parallax

These checks reject weak or geometrically unstable points before they enter the map.

## Reprojection error meaning
Reprojection error measures how far a projected 3D point lands from the original observed keypoint in the image. Low error suggests the triangulated point is consistent with both camera poses and image measurements; high error indicates a likely outlier or poor baseline.

## Outputs
- seed sparse 3D points for map initialization
- mean reprojection diagnostics for the initializer
- reusable projection and triangulation helpers for later keyframe pairs
