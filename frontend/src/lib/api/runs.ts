import { runDetailsById, runSummaries } from "@/src/lib/mock/runs";
import type { RunDetails, RunSummary } from "@/src/types/run";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getRuns(): Promise<RunSummary[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/runs`, { cache: "no-store" });
    return (await response.json()) as RunSummary[];
  }
  return runSummaries;
}

export async function getRunDetails(runId: string): Promise<RunDetails | null> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/runs/${runId}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as RunDetails;
  }
  return runDetailsById[runId] ?? null;
}
