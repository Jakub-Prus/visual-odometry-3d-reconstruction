import { failureCases, fallbackEvents, warningEvents } from "@/src/lib/mock/diagnostics";
import type { FailureCase, FallbackEvent, WarningEvent } from "@/src/types/diagnostics";

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getWarnings(): Promise<WarningEvent[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/diagnostics/warnings`, { cache: "no-store" });
    return (await response.json()) as WarningEvent[];
  }
  return warningEvents;
}

export async function getFallbackEvents(): Promise<FallbackEvent[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/diagnostics/fallbacks`, { cache: "no-store" });
    return (await response.json()) as FallbackEvent[];
  }
  return fallbackEvents;
}

export async function getFailureCases(): Promise<FailureCase[]> {
  if (APP_MODE === "api") {
    const response = await fetch(`${API_BASE_URL}/api/failures`, { cache: "no-store" });
    return (await response.json()) as FailureCase[];
  }
  return failureCases;
}
