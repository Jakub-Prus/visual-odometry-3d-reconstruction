import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { MapPointDetails } from "@/src/types/point";
import { formatNumber } from "@/src/lib/utils/format";
import { PointObservationList } from "@/components/correspondences/point-observation-list";

interface PointInspectorPanelProps {
  runId: string;
  point?: MapPointDetails;
  sequenceFrames: SequenceFrame[];
  activeObservationIndex: number;
  onSelectObservation: (observationIndex: number, frameId: number) => void;
}

export function PointInspectorPanel({
  runId,
  point,
  sequenceFrames,
  activeObservationIndex,
  onSelectObservation
}: PointInspectorPanelProps) {
  if (!point) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Point inspector</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Select a 3D point to inspect linked observations and jump into image evidence.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{point.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
          <p>Observation count: <span className="text-slate-100">{point.observationCount}</span></p>
          <p>Valid: <span className="text-slate-100">{point.isValid ? "yes" : "no"}</span></p>
          <p>Mean reprojection: <span className="text-slate-100">{point.meanReprojectionError !== undefined ? `${formatNumber(point.meanReprojectionError)} px` : "n/a"}</span></p>
          <p>XYZ: <span className="text-slate-100">{point.xyz.map((value) => formatNumber(value)).join(", ")}</span></p>
        </div>
        <PointObservationList
          point={point}
          sequenceFrames={sequenceFrames}
          activeObservationIndex={activeObservationIndex}
          onSelectObservation={onSelectObservation}
        />
        <div className="flex flex-wrap gap-2">
          <Link href={`/results/${runId}/sequence`} className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
            Browse sequence
          </Link>
          <Link href={`/results/${runId}/correspondences`} className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
            Open split view
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
