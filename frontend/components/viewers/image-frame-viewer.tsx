"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RunFrame } from "@/src/types/frame";

interface ImageFrameViewerProps {
  frames: RunFrame[];
}

type OverlayMode = "source" | "features" | "matches" | "reprojection";

export function ImageFrameViewer({ frames }: ImageFrameViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("source");
  const frame = frames[activeIndex];

  const imageUrl = useMemo(() => {
    switch (overlayMode) {
      case "features":
        return frame.featureOverlayUrl ?? frame.imageUrl;
      case "matches":
        return frame.matchOverlayUrl ?? frame.imageUrl;
      case "reprojection":
        return frame.reprojectionOverlayUrl ?? frame.imageUrl;
      default:
        return frame.imageUrl;
    }
  }, [frame, overlayMode]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>Frame Inspector</CardTitle>
        <div className="flex flex-wrap gap-2">
          {(["source", "features", "matches", "reprojection"] as OverlayMode[]).map((mode) => (
            <Button key={mode} onClick={() => setOverlayMode(mode)} className={overlayMode === mode ? "border-accent/60 text-white" : ""}>
              {mode}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <Image src={imageUrl} alt={`Frame ${frame.frameId}`} width={960} height={540} className="h-auto w-full object-cover" />
        </div>
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={activeIndex}
          onChange={(event) => setActiveIndex(Number(event.target.value))}
          className="w-full accent-[#64d3ff]"
        />
        <div className="grid gap-3 text-sm text-muted md:grid-cols-3">
          <p>Frame: <span className="text-slate-100">{frame.frameId}</span></p>
          <p>Pose source: <span className="text-slate-100">{frame.poseSource}</span></p>
          <p>Tracked points: <span className="text-slate-100">{frame.trackedPoints}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
