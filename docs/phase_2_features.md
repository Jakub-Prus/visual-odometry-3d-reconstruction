# Phase 2: Features

## ORB and SIFT
ORB is the default feature detector because it is fast and suitable for a lightweight VO baseline. SIFT is supported when available in the OpenCV build and can be enabled through configuration for a higher-quality but slower alternative.

## Descriptor matching
Descriptors are matched with `cv2.BFMatcher`. ORB uses Hamming distance for binary descriptors, while SIFT uses L2 distance for floating-point descriptors.

## Ratio test
The matcher applies Lowe's ratio test on KNN matches (`k=2`). This keeps the best match only when it is sufficiently better than the runner-up, which reduces ambiguous correspondences before essential-matrix estimation.

## Visualization strategy
This foundation phase focuses on reliable numeric outputs first. The immediate strategy is to log keypoint, match, and inlier counts per frame; later phases can add feature-track overlays and trajectory plots without changing the detector or matcher interfaces.
