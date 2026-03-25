import type { ArtifactFile, ArtifactImage } from "@/src/types/artifact";
import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { MapPointDetails } from "@/src/types/point";
import type { WarningEvent } from "@/src/types/diagnostics";
import type { RunFrame } from "@/src/types/frame";
import type { FrameMetric } from "@/src/types/metrics";

export interface ResultDetails {
  id: string;
  name: string;
  dataset: string;
  status: "completed" | "running" | "failed";
  createdAt: string;
  durationSec?: number;
  detector: string;
  matcher: string;
  poseMethod: "pnp" | "mixed" | "fallback" | "essential";
  summary: {
    initialized: boolean;
    totalFrames: number;
    processedFrames: number;
    keyframes: number;
    mapPoints: number;
    meanReprojectionError?: number;
    medianReprojectionError?: number;
    ate?: number;
    rpe?: number;
  };
  artifacts: {
    trajectory2D?: Array<{ x: number; y: number; z?: number }>;
    pointCloudUrl?: string;
    previewImages: ArtifactImage[];
    exportFiles: ArtifactFile[];
    pointCloudPreview?: Array<{ x: number; y: number; z: number }>;
    keyframePositions?: Array<{ frameId: number; x: number; z: number }>;
  };
  interpretation?: string[];
  metricsByFrame?: FrameMetric[];
  warnings?: WarningEvent[];
  config?: Record<string, unknown>;
  frames?: RunFrame[];
  correspondence: {
    imageWidth: number;
    imageHeight: number;
    defaultPointId?: string;
    mapPoints: MapPointDetails[];
    sequenceFrames: SequenceFrame[];
  };
}
