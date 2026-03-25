import type { FrameMetric } from "@/src/types/metrics";

export function latestFrameMetric(metrics: FrameMetric[]): FrameMetric | undefined {
  return metrics[metrics.length - 1];
}

export function averageReprojectionError(metrics: FrameMetric[]): number {
  const values = metrics
    .map((metric) => metric.reprojectionError)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
