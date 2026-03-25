"use client";

import { useParams, usePathname } from "next/navigation";

import { JsonCodeBlock } from "@/components/common/json-code-block";
import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { ResultSubnav } from "@/components/results/result-subnav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultDetailsPage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);

  if (!result) {
    return (
      <AppShell title="Technical Details">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell title="Technical Details">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Config</CardTitle>
          </CardHeader>
          <CardContent>
            <JsonCodeBlock data={result.config ?? {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warnings and notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            {(result.warnings ?? []).map((warning) => (
              <div key={warning.id} className="rounded-2xl border border-border bg-slate-950/35 px-4 py-3">
                <p className="font-medium text-slate-100">{warning.title}</p>
                <p className="mt-1">{warning.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Frame-level metrics</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <THead>
              <tr>
                <TH>Frame</TH>
                <TH>Keypoints</TH>
                <TH>Matches</TH>
                <TH>Inliers</TH>
                <TH>Tracked points</TH>
                <TH>Pose source</TH>
                <TH>Reprojection</TH>
              </tr>
            </THead>
            <TBody>
              {(result.metricsByFrame ?? []).map((metric) => (
                <tr key={metric.frameId}>
                  <TD>{metric.frameId}</TD>
                  <TD>{metric.numKeypoints}</TD>
                  <TD>{metric.numMatches}</TD>
                  <TD>{metric.numInliers}</TD>
                  <TD>{metric.numTrackedPoints}</TD>
                  <TD>{metric.poseSource}</TD>
                  <TD>{metric.reprojectionError ?? "n/a"}</TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
