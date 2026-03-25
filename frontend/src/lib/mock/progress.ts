import { getDemoRunProgress, getDemoRunRecord } from "@/src/lib/mock/demo-run-store";
import type { RunProgress } from "@/src/types/progress";

export async function getMockRunProgress(runId: string): Promise<RunProgress | null> {
  const record = getDemoRunRecord(runId);
  if (!record) {
    return null;
  }
  return getDemoRunProgress(record);
}
