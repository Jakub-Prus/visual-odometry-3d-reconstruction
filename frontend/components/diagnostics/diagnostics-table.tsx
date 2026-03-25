import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import type { FrameMetric } from "@/src/types/metrics";

export function DiagnosticsTable({ metrics }: { metrics: FrameMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnostics Table</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead>
            <tr>
              <TH>Frame</TH>
              <TH>Pose Source</TH>
              <TH>Matches</TH>
              <TH>Inliers</TH>
              <TH>Tracked</TH>
              <TH>Reprojection</TH>
            </tr>
          </THead>
          <TBody>
            {metrics.map((metric) => (
              <tr key={metric.frameId}>
                <TD>{metric.frameId}</TD>
                <TD>{metric.poseSource}</TD>
                <TD>{metric.numMatches}</TD>
                <TD>{metric.numInliers}</TD>
                <TD>{metric.numTrackedPoints}</TD>
                <TD>{metric.reprojectionError ?? "n/a"}</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
