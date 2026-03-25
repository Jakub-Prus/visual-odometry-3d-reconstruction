import { experimentResults } from "@/src/lib/mock/experiments";
import type { ExperimentResult } from "@/src/types/experiment";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getExperiments(): Promise<ExperimentResult[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/experiments`, { cache: "no-store" });
    return (await response.json()) as ExperimentResult[];
  }
  return experimentResults;
}
