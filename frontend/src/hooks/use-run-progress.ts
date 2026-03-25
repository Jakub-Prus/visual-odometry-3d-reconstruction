"use client";

import { useEffect, useState } from "react";

import { getRunProgress } from "@/src/lib/api/progress";
import type { RunProgress } from "@/src/types/progress";

export function useRunProgress(runId: string | null, refreshMs = 1000): RunProgress | null {
  const [progress, setProgress] = useState<RunProgress | null>(null);

  useEffect(() => {
    if (!runId) {
      setProgress(null);
      return undefined;
    }
    const activeRunId = runId;

    async function load(): Promise<void> {
      setProgress(await getRunProgress(activeRunId));
    }

    void load();
    const timer = window.setInterval(() => void load(), refreshMs);
    return () => window.clearInterval(timer);
  }, [refreshMs, runId]);

  return progress;
}
