"use client";

import { useEffect, useState } from "react";

import { getResultDetails } from "@/src/lib/api/results";
import type { ResultDetails } from "@/src/types/result";

export function useResultDetails(runId: string, refreshMs?: number): ResultDetails | null {
  const [result, setResult] = useState<ResultDetails | null>(null);

  useEffect(() => {
    async function load(): Promise<void> {
      setResult(await getResultDetails(runId));
    }

    void load();
    if (!refreshMs) {
      return undefined;
    }
    const timer = window.setInterval(() => void load(), refreshMs);
    return () => window.clearInterval(timer);
  }, [refreshMs, runId]);

  return result;
}
