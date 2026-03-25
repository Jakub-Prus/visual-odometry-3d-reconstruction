import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import type { RunFrame } from "@/src/types/frame";

export function FrameQualityTable({ frames }: { frames: RunFrame[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frame Quality</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead>
            <tr>
              <TH>Frame</TH>
              <TH>Keypoints</TH>
              <TH>Matches</TH>
              <TH>Inliers</TH>
              <TH>Tracked</TH>
              <TH>Keyframe</TH>
            </tr>
          </THead>
          <TBody>
            {frames.map((frame) => (
              <tr key={frame.frameId}>
                <TD>{frame.frameId}</TD>
                <TD>{frame.keypoints}</TD>
                <TD>{frame.matches}</TD>
                <TD>{frame.inliers}</TD>
                <TD>{frame.trackedPoints}</TD>
                <TD>{frame.keyframeInserted ? "yes" : "no"}</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
