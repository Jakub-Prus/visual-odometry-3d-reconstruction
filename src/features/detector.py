"""Feature detector implementations."""

from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np

ORB_FEATURE_TYPE = "orb"
SIFT_FEATURE_TYPE = "sift"


@dataclass(slots=True)
class FeatureSet:
    """Feature extraction output for one image."""

    keypoints: list[cv2.KeyPoint]
    descriptors: np.ndarray | None


class FeatureDetector:
    """Feature detector wrapper with ORB and optional SIFT support."""

    def __init__(self, feature_type: str, nfeatures: int = 2000) -> None:
        normalized_type = feature_type.lower()
        self.feature_type = normalized_type
        self.nfeatures = nfeatures
        self.detector = self._create_detector(normalized_type, nfeatures)

    def detect_and_compute(self, image_gray: np.ndarray) -> FeatureSet:
        """Detect keypoints and compute descriptors for a grayscale image."""
        keypoints, descriptors = self.detector.detectAndCompute(image_gray, None)
        return FeatureSet(keypoints=keypoints, descriptors=descriptors)

    @staticmethod
    def _create_detector(feature_type: str, nfeatures: int) -> cv2.Feature2D:
        """Create the configured OpenCV feature detector."""
        if feature_type == ORB_FEATURE_TYPE:
            return cv2.ORB_create(nfeatures=nfeatures)
        if feature_type == SIFT_FEATURE_TYPE:
            if not hasattr(cv2, "SIFT_create"):
                raise ValueError("SIFT is not available in this OpenCV build.")
            return cv2.SIFT_create(nfeatures=nfeatures)
        raise ValueError(f"Unsupported feature type: {feature_type}")
