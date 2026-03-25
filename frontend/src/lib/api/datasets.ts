import { demoDatasets } from "@/src/lib/mock/datasets";
import type { DatasetSummary } from "@/src/types/summary";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getDatasets(): Promise<DatasetSummary[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/datasets`, { cache: "no-store" });
    return (await response.json()) as DatasetSummary[];
  }
  return demoDatasets;
}
