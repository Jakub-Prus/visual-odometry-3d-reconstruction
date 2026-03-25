"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FrameMetric } from "@/src/types/metrics";

interface FrameTimelineProps {
  metrics: FrameMetric[];
}

export function FrameTimeline({ metrics }: FrameTimelineProps) {
  const [frameIndex, setFrameIndex] = useState(metrics[0]?.frameId ?? 0);
  const metric = useMemo(() => metrics.find((candidate) => candidate.frameId === frameIndex) ?? metrics[0], [frameIndex, metrics]);

  if (!metric) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frame Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="range"
          min={metrics[0].frameId}
          max={metrics[metrics.length - 1].frameId}
          value={frameIndex}
          onChange={(event) => setFrameIndex(Number(event.target.value))}
          className="w-full accent-[#64d3ff]"
        />
        <div className="grid gap-3 rounded-2xl border border-border bg-slate-950/50 p-4 text-sm text-muted md:grid-cols-3">
          <p>Frame <span className="text-white">{metric.frameId}</span></p>
          <p>Pose source <span className="text-white">{metric.poseSource}</span></p>
          <p>Reprojection <span className="text-white">{metric.reprojectionError ?? "n/a"}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
