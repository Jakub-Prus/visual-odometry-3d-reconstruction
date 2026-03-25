"use client";

import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { MapGrowthChart } from "@/components/metrics/map-growth-chart";
import { MetricsSummaryGrid } from "@/components/metrics/metrics-summary-grid";
import { ReprojectionSummaryChart } from "@/components/metrics/reprojection-summary-chart";
import { TrackSummaryChart } from "@/components/metrics/track-summary-chart";
import { ResultSubnav } from "@/components/results/result-subnav";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultMetricsPage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);

  if (!result) {
    return (
      <AppShell title="Metrics">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell title="Metrics">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <MetricsSummaryGrid result={result} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ReprojectionSummaryChart metrics={result.metricsByFrame ?? []} />
        <TrackSummaryChart metrics={result.metricsByFrame ?? []} />
      </div>
      <MapGrowthChart metrics={result.metricsByFrame ?? []} />
    </AppShell>
  );
}
