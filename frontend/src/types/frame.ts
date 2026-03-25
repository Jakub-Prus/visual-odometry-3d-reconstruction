export interface RunFrame {
  frameId: number;
  imageUrl: string;
  previousImageUrl?: string;
  featureOverlayUrl?: string;
  matchOverlayUrl?: string;
  reprojectionOverlayUrl?: string;
  keypoints: number;
  matches: number;
  inliers: number;
  trackedPoints: number;
  poseSource: "initialization" | "essential" | "pnp" | "fallback";
  reprojectionError: number | null;
  keyframeInserted: boolean;
  notes?: string;
}
