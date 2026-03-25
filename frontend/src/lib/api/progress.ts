import { getMockRunProgress } from "@/src/lib/mock/progress";
import type { RunProgress } from "@/src/types/progress";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getRunProgress(runId: string): Promise<RunProgress | null> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/runs/${runId}/progress`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as RunProgress;
  }
  return getMockRunProgress(runId);
}
