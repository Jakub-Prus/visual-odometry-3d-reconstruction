"""Descriptor matching helpers."""

from __future__ import annotations

import cv2
import numpy as np

ORB_FEATURE_TYPE = "orb"
KNN_MATCH_COUNT = 2


class FeatureMatcher:
    """Brute-force matcher with Lowe's ratio test."""

    def __init__(self, feature_type: str, ratio_test: float = 0.75) -> None:
        self.feature_type = feature_type.lower()
        self.ratio_test = ratio_test
        norm = cv2.NORM_HAMMING if self.feature_type == ORB_FEATURE_TYPE else cv2.NORM_L2
        self.matcher = cv2.BFMatcher(normType=norm, crossCheck=False)

    def match(
        self,
        descriptors_a: np.ndarray | None,
        descriptors_b: np.ndarray | None,
    ) -> list[cv2.DMatch]:
        """Match two descriptor sets and apply Lowe's ratio test."""
        if descriptors_a is None or descriptors_b is None:
            return []
        knn_matches = self.matcher.knnMatch(descriptors_a, descriptors_b, k=KNN_MATCH_COUNT)
        filtered_matches: list[cv2.DMatch] = []
        for candidate_matches in knn_matches:
            if len(candidate_matches) < KNN_MATCH_COUNT:
                continue
            best_match, second_match = candidate_matches
            if best_match.distance < self.ratio_test * second_match.distance:
                filtered_matches.append(best_match)
        return sorted(filtered_matches, key=lambda match: match.distance)
