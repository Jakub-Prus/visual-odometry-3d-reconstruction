import { notFound } from "next/navigation";

import { InlierChart } from "@/components/charts/inlier-chart";
import { ReprojectionChart } from "@/components/charts/reprojection-chart";
import { TrackCountChart } from "@/components/charts/track-count-chart";
import { DiagnosticsTable } from "@/components/diagnostics/diagnostics-table";
import { FallbackEventsList } from "@/components/diagnostics/fallback-events-list";
import { FrameQualityTable } from "@/components/diagnostics/frame-quality-table";
import { WarningPanel } from "@/components/diagnostics/warning-panel";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { getFallbackEvents, getWarnings } from "@/src/lib/api/diagnostics";
import { getRunDetails } from "@/src/lib/api/runs";

export default async function RunDiagnosticsPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRunDetails(runId);
  if (!run) {
    notFound();
  }
  const [warnings, fallbackEvents] = await Promise.all([getWarnings(), getFallbackEvents()]);

  return (
    <AppShell title="Diagnostics">
      <SectionHeader
        eyebrow="Engineering Depth"
        title={`Diagnostics for ${run.name}`}
        description="Frame-level metrics, warnings, and fallback behavior designed to show how the system behaves under stress."
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <ReprojectionChart metrics={run.metricsByFrame} />
        <InlierChart metrics={run.metricsByFrame} />
        <TrackCountChart metrics={run.metricsByFrame} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DiagnosticsTable metrics={run.metricsByFrame} />
        <WarningPanel warnings={warnings} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <FallbackEventsList events={fallbackEvents} />
        <FrameQualityTable frames={run.frames} />
      </div>
    </AppShell>
  );
}
