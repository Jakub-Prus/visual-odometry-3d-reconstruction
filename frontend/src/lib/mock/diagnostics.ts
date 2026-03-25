import type { FailureCase, FallbackEvent, WarningEvent } from "@/src/types/diagnostics";

export const fallbackEvents: FallbackEvent[] = [
  {
    id: "fb-12",
    frameId: 12,
    from: "pnp",
    to: "fallback",
    reason: "PnP inliers fell below the configured threshold after track loss."
  },
  {
    id: "fb-13",
    frameId: 13,
    from: "pnp",
    to: "fallback",
    reason: "Fallback was repeated while the map was being re-stabilized."
  }
];

export const warningEvents: WarningEvent[] = [
  {
    id: "diag-1",
    severity: "warning",
    frameId: 8,
    title: "Low-parallax candidate rejected",
    description: "Initializer skipped an early pair because the triangulation angle was too small."
  },
  {
    id: "diag-2",
    severity: "warning",
    frameId: 12,
    title: "Rising reprojection error",
    description: "Several active map points exceeded the preferred local tracking error."
  },
  {
    id: "diag-3",
    severity: "error",
    frameId: 13,
    title: "PnP fallback event",
    description: "Tracking switched to essential-matrix motion to preserve continuity."
  }
];

export const failureCases: FailureCase[] = [
  {
    id: "low-texture",
    title: "Low Texture Corridor",
    imageUrl: "/demo/images/failure-low-texture.svg",
    symptom: "Few stable features and rapidly collapsing inlier counts.",
    whyItHappens: "The detector cannot produce enough distinctive correspondences on flat surfaces.",
    systemResponse: "Initializer and tracker reject weak geometry and may fall back or fail to initialize.",
    mitigation: "Use richer features, add semantic masking, or widen the baseline when possible."
  },
  {
    id: "motion-blur",
    title: "Motion Blur",
    imageUrl: "/demo/images/failure-motion-blur.svg",
    symptom: "High descriptor ambiguity and unstable keypoint repeatability.",
    whyItHappens: "Blur lowers local contrast and corrupts feature localization.",
    systemResponse: "Match quality drops, reprojection error rises, and fallback events become frequent.",
    mitigation: "Shorter exposure, frame quality gating, or IMU-assisted motion priors."
  },
  {
    id: "pure-rotation",
    title: "Pure Rotation",
    imageUrl: "/demo/images/failure-rotation.svg",
    symptom: "Weak triangulation and unreliable map growth despite visually consistent motion.",
    whyItHappens: "Monocular triangulation requires translational baseline to recover depth robustly.",
    systemResponse: "Initialization may reject the pair due to low parallax and insufficient valid points.",
    mitigation: "Delay initialization until translation appears or fuse depth/other sensors."
  },
  {
    id: "repeated-patterns",
    title: "Repeated Patterns",
    imageUrl: "/demo/images/failure-repeated-patterns.svg",
    symptom: "False positive matches and unstable map points.",
    whyItHappens: "Repeated local appearance defeats simple nearest-neighbor descriptor matching.",
    systemResponse: "RANSAC removes many outliers, but map quality can still degrade.",
    mitigation: "Stronger descriptors, cross-checking, or semantic/geometry-aware verification."
  },
  {
    id: "dynamic-scene",
    title: "Dynamic Scene Objects",
    imageUrl: "/demo/images/failure-dynamic-scene.svg",
    symptom: "Moving features inject non-rigid motion into the estimation step.",
    whyItHappens: "The model assumes a mostly static scene while vehicles or people violate that assumption.",
    systemResponse: "PnP support weakens and reprojection filtering prunes unstable points.",
    mitigation: "Dynamic object masking and multi-model motion segmentation."
  }
];
