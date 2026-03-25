import { createDemoRunRecord } from "@/src/lib/mock/demo-run-store";
import { demoDatasets } from "@/src/lib/mock/datasets";
import type { RunRequest } from "@/src/types/run-request";

export async function createMockRun(request: RunRequest): Promise<{ runId: string }> {
  const dataset = demoDatasets.find((candidate) => candidate.id === request.datasetId);
  const totalFrames = request.maxFrames ?? dataset?.frameCount ?? 50;
  const record = createDemoRunRecord(request, dataset?.name ?? request.fileName ?? "Custom sequence", totalFrames);
  return { runId: record.id };
}
