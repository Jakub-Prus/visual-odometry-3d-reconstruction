export interface RunRequest {
  inputType: "dataset" | "video" | "images";
  datasetId?: string;
  fileName?: string;
  detector: "orb" | "sift";
  usePnP: boolean;
  useBundleAdjustment: boolean;
  maxFrames?: number;
  qualityPreset: "fast" | "balanced" | "accurate";
}
