import { getRunDetails } from "@/src/lib/api/runs";
import type { FrameMetric } from "@/src/types/metrics";

export async function getMetrics(runId: string): Promise<FrameMetric[]> {
  const details = await getRunDetails(runId);
  return details?.metricsByFrame ?? [];
}
