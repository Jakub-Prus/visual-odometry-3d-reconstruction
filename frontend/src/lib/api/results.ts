import { getMockResultDetails, getMockResults } from "@/src/lib/mock/results";
import type { ResultDetails } from "@/src/types/result";
import type { ResultSummary } from "@/src/types/summary";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getResults(): Promise<ResultSummary[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/results`, { cache: "no-store" });
    return (await response.json()) as ResultSummary[];
  }
  return getMockResults();
}

export async function getResultDetails(runId: string): Promise<ResultDetails | null> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/results/${runId}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as ResultDetails;
  }
  return getMockResultDetails(runId);
}
