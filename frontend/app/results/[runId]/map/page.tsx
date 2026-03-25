"use client";

import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { ResultSubnav } from "@/components/results/result-subnav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedTrajectoryMapViewer } from "@/components/viewers/linked-trajectory-map-viewer";
import { useInitializeResultViewer } from "@/src/hooks/use-initialize-result-viewer";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultMapPage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);
  useInitializeResultViewer(result);

  if (!result) {
    return (
      <AppShell title="Map View">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell title="Map View">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <LinkedTrajectoryMapViewer result={result} />
      <Card>
        <CardHeader>
          <CardTitle>Spatial summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted md:grid-cols-4">
          <p>Keyframes: <span className="text-slate-100">{result.summary.keyframes}</span></p>
          <p>Map points: <span className="text-slate-100">{result.summary.mapPoints}</span></p>
          <p>Processed frames: <span className="text-slate-100">{result.summary.processedFrames}</span></p>
          <p>Pose method: <span className="text-slate-100">{result.poseMethod}</span></p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
