export interface ResultSummary {
  id: string;
  name: string;
  dataset: string;
  status: "completed" | "running" | "failed";
  createdAt: string;
  durationSec?: number;
  keyframes: number;
  mapPoints: number;
  meanReprojectionError?: number;
  ate?: number;
  rpe?: number;
  previewImage?: string;
}

export interface DatasetSummary {
  id: string;
  name: string;
  source: "demo" | "upload";
  description: string;
  frameCount?: number;
  previewImage?: string;
  recommendedDetector: "orb" | "sift";
  tags: string[];
}
