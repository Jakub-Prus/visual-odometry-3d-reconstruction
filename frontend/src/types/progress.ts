export interface RunProgress {
  runId: string;
  status: "queued" | "running" | "completed" | "failed";
  stage: "preparing" | "initialization" | "tracking" | "triangulation" | "optimization" | "finalizing";
  progressPercent: number;
  currentFrame?: number;
  totalFrames?: number;
  elapsedSec?: number;
  message?: string;
}
