import type { FrameMetric } from "@/src/types/metrics";
import type { WarningEvent } from "@/src/types/diagnostics";
import type { RunFrame } from "@/src/types/frame";

export interface RunSummary {
  id: string;
  name: string;
  dataset: string;
  status: "completed" | "running" | "failed";
  createdAt: string;
  detector: string;
  matcher: string;
  totalFrames: number;
  keyframes: number;
  mapPoints: number;
}

export interface RunArtifact {
  label: string;
  href: string;
  kind: "image" | "json" | "pointcloud" | "log";
}

export interface RunDetails {
  id: string;
  name: string;
  dataset: string;
  config: Record<string, unknown>;
  status: RunSummary["status"];
  summary: {
    totalFrames: number;
    initialized: boolean;
    keyframes: number;
    mapPoints: number;
    meanReprojectionError: number;
    ate?: number;
    rpe?: number;
  };
  detector: string;
  matcher: string;
  trajectory2D: Array<{ x: number; y: number; z?: number }>;
  metricsByFrame: FrameMetric[];
  warnings: WarningEvent[];
  artifacts: RunArtifact[];
  frames: RunFrame[];
  keyframePositions: Array<{ frameId: number; x: number; z: number }>;
  pointCloudPreview: Array<{ x: number; y: number; z: number }>;
  pointCloudAsset?: string;
}
