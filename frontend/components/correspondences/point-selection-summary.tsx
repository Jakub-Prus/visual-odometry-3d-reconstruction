import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { MapPointDetails } from "@/src/types/point";
import { formatNumber } from "@/src/lib/utils/format";

interface PointSelectionSummaryProps {
  runId: string;
  point?: MapPointDetails;
  frame?: SequenceFrame;
}

export function PointSelectionSummary({ runId, point, frame }: PointSelectionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Correspondence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted">
        {point ? (
          <>
            <p className="text-slate-100">{point.id}</p>
            <p>{point.observationCount} linked observations</p>
            <p>Mean reprojection: {point.meanReprojectionError !== undefined ? `${formatNumber(point.meanReprojectionError)} px` : "n/a"}</p>
            <p>{frame ? `Current linked frame: ${frame.frameId}` : "Select a linked frame to inspect image evidence."}</p>
          </>
        ) : (
          <p>Select a point in the sparse map to reveal its linked image observations.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href={`/results/${runId}/correspondences`} className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
            Open correspondence view
          </Link>
          <Link href={`/results/${runId}/sequence`} className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
            Browse sequence
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
