export interface FrameMetric {
  frameId: number;
  numKeypoints: number;
  numMatches: number;
  numInliers: number;
  numTrackedPoints: number;
  reprojectionError: number | null;
  poseSource: "initialization" | "essential" | "pnp" | "fallback";
  keyframeInserted: boolean;
  mapPoints?: number;
}
