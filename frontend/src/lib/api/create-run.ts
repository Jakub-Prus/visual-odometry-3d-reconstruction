import { createMockRun } from "@/src/lib/mock/create-run";
import type { RunRequest } from "@/src/types/run-request";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function createRun(request: RunRequest): Promise<{ runId: string }> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    return (await response.json()) as { runId: string };
  }
  return createMockRun(request);
}
