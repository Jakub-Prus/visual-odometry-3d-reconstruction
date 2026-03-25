import type { RunDetails, RunSummary } from "@/src/types/run";

const metrics = Array.from({ length: 14 }, (_, index) => {
  const frameId = index;
  const bootstrap = frameId < 2;
  const pnpActive = frameId >= 2 && frameId < 9;
  return {
    frameId,
    numKeypoints: bootstrap ? 2900 : 2850 - index * 14,
    numMatches: bootstrap ? 410 : 240 - index * 9,
    numInliers: bootstrap ? 180 : 190 - index * 11,
    numTrackedPoints: bootstrap ? 0 : 170 - index * 6,
    reprojectionError: bootstrap ? 0.94 : Number((0.82 + index * 0.04).toFixed(2)),
    poseSource: bootstrap ? "initialization" : pnpActive ? "pnp" : "fallback",
    keyframeInserted: bootstrap || index % 2 === 0,
    mapPoints: 102 + index * 3
  } as const;
});

const frames = metrics.map((metric) => ({
  frameId: metric.frameId,
  imageUrl: "/demo/images/frame-grid.svg",
  previousImageUrl: "/demo/images/frame-grid-secondary.svg",
  featureOverlayUrl: "/demo/images/features-overlay.svg",
  matchOverlayUrl: "/demo/images/matches-overlay.svg",
  reprojectionOverlayUrl: "/demo/images/reprojection-overlay.svg",
  keypoints: metric.numKeypoints,
  matches: metric.numMatches,
  inliers: metric.numInliers,
  trackedPoints: metric.numTrackedPoints,
  poseSource: metric.poseSource,
  reprojectionError: metric.reprojectionError,
  keyframeInserted: metric.keyframeInserted,
  notes:
    metric.poseSource === "fallback"
      ? "PnP support dropped below threshold; frame-to-frame essential matrix was used."
      : "Stable local tracking with active map support."
}));

export const runSummaries: RunSummary[] = [
  {
    id: "kitti-seed-001",
    name: "KITTI Seed Map Baseline",
    dataset: "KITTI Demo Sequence",
    status: "completed",
    createdAt: "2026-03-25T10:23:00.000Z",
    detector: "ORB",
    matcher: "BF + Ratio Test",
    totalFrames: 20,
    keyframes: 14,
    mapPoints: 102
  },
  {
    id: "rotation-failure-002",
    name: "Pure Rotation Stress Test",
    dataset: "Synthetic Rotation Case",
    status: "failed",
    createdAt: "2026-03-24T18:18:00.000Z",
    detector: "ORB",
    matcher: "BF + Ratio Test",
    totalFrames: 20,
    keyframes: 2,
    mapPoints: 14
  }
];

export const runDetailsById: Record<string, RunDetails> = {
  "kitti-seed-001": {
    id: "kitti-seed-001",
    name: "KITTI Seed Map Baseline",
    dataset: "KITTI Demo Sequence",
    status: "completed",
    detector: "ORB",
    matcher: "BF + Ratio Test",
    config: {
      dataset: { type: "kitti", resize: [640, 480] },
      initialization: { minInliers: 80, minParallaxDeg: 1.0 },
      triangulation: { maxReprojError: 3.0, minDepth: 0.1 },
      pnp: { enabled: true, minInliers: 30 },
      keyframe: { minTranslation: 0.15, minRotationDeg: 5.0 }
    },
    summary: {
      totalFrames: 20,
      initialized: true,
      keyframes: 14,
      mapPoints: 102,
      meanReprojectionError: 0.91,
      ate: 0.34,
      rpe: 0.08
    },
    trajectory2D: [
      { x: 0.0, y: 0.0, z: 0.0 },
      { x: -0.2, y: 0.05, z: 0.04 },
      { x: -0.42, y: 0.11, z: 0.1 },
      { x: -0.63, y: 0.18, z: 0.15 },
      { x: -0.85, y: 0.25, z: 0.2 },
      { x: -0.94, y: 0.35, z: 0.27 },
      { x: -1.1, y: 0.42, z: 0.31 },
      { x: -1.28, y: 0.56, z: 0.4 },
      { x: -1.36, y: 0.66, z: 0.51 },
      { x: -1.4, y: 0.83, z: 0.61 },
      { x: -1.36, y: 1.02, z: 0.71 },
      { x: -1.22, y: 1.18, z: 0.82 },
      { x: -1.06, y: 1.28, z: 0.91 },
      { x: -0.88, y: 1.36, z: 1.02 }
    ],
    metricsByFrame: metrics,
    warnings: [
      {
        id: "warn-1",
        severity: "warning",
        frameId: 10,
        title: "PnP support dropping",
        description: "Tracked 3D points fell below the stable threshold; fallback risk increased."
      },
      {
        id: "warn-2",
        severity: "info",
        frameId: 0,
        title: "Bootstrap selected frame pair 0 → 7",
        description: "Initializer skipped low-parallax pairs before seeding the map."
      },
      {
        id: "warn-3",
        severity: "error",
        frameId: 12,
        title: "Fallback event detected",
        description: "PnP was rejected due to weak inlier support; essential matrix tracking was used."
      }
    ],
    artifacts: [
      { label: "Trajectory Plot", href: "/demo/images/trajectory-plot.svg", kind: "image" },
      { label: "Sparse Point Cloud", href: "/demo/pointclouds/sample-cloud.ply", kind: "pointcloud" },
      { label: "Run Summary", href: "/demo/runs/kitti-seed-001.json", kind: "json" }
    ],
    frames,
    keyframePositions: [
      { frameId: 0, x: 0, z: 0 },
      { frameId: 7, x: -0.94, z: 0.35 },
      { frameId: 10, x: -1.36, z: 1.02 },
      { frameId: 13, x: -0.88, z: 1.36 }
    ],
    pointCloudPreview: Array.from({ length: 90 }, (_, index) => ({
      x: Math.sin(index * 0.21) * 1.7,
      y: Math.cos(index * 0.11) * 0.5,
      z: Math.cos(index * 0.17) * 1.4
    })),
    pointCloudAsset: "/demo/pointclouds/sample-cloud.ply"
  },
  "rotation-failure-002": {
    id: "rotation-failure-002",
    name: "Pure Rotation Stress Test",
    dataset: "Synthetic Rotation Case",
    status: "failed",
    detector: "ORB",
    matcher: "BF + Ratio Test",
    config: {
      dataset: { type: "synthetic-rotation" },
      initialization: { minInliers: 80, minParallaxDeg: 1.0 }
    },
    summary: {
      totalFrames: 20,
      initialized: false,
      keyframes: 2,
      mapPoints: 14,
      meanReprojectionError: 4.8
    },
    trajectory2D: [
      { x: 0, y: 0 },
      { x: 0.02, y: 0.01 },
      { x: 0.04, y: 0.02 }
    ],
    metricsByFrame: metrics.slice(0, 6).map((metric) => ({
      ...metric,
      poseSource: "fallback" as const,
      reprojectionError: 4.8,
      numTrackedPoints: 18
    })),
    warnings: [
      {
        id: "failure-rotation",
        severity: "error",
        title: "Insufficient parallax for reliable triangulation",
        description: "Initialization never found a stable baseline with enough depth diversity."
      }
    ],
    artifacts: [
      { label: "Failure Snapshot", href: "/demo/images/failure-rotation.svg", kind: "image" }
    ],
    frames: frames.slice(0, 6),
    keyframePositions: [],
    pointCloudPreview: [],
    pointCloudAsset: "/demo/pointclouds/sample-cloud.ply"
  }
};
