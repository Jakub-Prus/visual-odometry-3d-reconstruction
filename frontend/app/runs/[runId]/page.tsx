import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigPanel } from "@/components/runs/config-panel";
import { ExportPanel } from "@/components/runs/export-panel";
import { KeyMetricsGrid } from "@/components/runs/key-metrics-grid";
import { RunHeader } from "@/components/runs/run-header";
import { RunSummary } from "@/components/runs/run-summary";
import { Trajectory2DViewer } from "@/components/viewers/trajectory-2d-viewer";
import { getRunDetails } from "@/src/lib/api/runs";

export default async function RunOverviewPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRunDetails(runId);
  if (!run) {
    notFound();
  }

  return (
    <AppShell title="Run Overview">
      <RunHeader run={run} />
      <KeyMetricsGrid run={run} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RunSummary run={run} />
        <ConfigPanel config={run.config} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Trajectory2DViewer trajectory={run.trajectory2D} keyframes={run.keyframePositions} />
        <ExportPanel artifacts={run.artifacts} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Link className="rounded-xl border border-border px-4 py-4 text-sm hover:border-accent/50" href={`/runs/${run.id}/trajectory`}>
              Trajectory + map
            </Link>
            <Link className="rounded-xl border border-border px-4 py-4 text-sm hover:border-accent/50" href={`/runs/${run.id}/diagnostics`}>
              Diagnostics
            </Link>
            <Link className="rounded-xl border border-border px-4 py-4 text-sm hover:border-accent/50" href={`/runs/${run.id}/frames`}>
              Frame inspection
            </Link>
          </CardContent>
        </Card>
        <EmptyState
          title="Current limitations"
          description="This run still demonstrates monocular scale ambiguity, drift, and occasional PnP fallback when local support weakens."
        />
      </div>
    </AppShell>
  );
}
