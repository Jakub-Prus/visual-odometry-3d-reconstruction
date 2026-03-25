import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MapPointDetails } from "@/src/types/point";
import { formatNumber } from "@/src/lib/utils/format";

interface PointHoverCardProps {
  point?: MapPointDetails;
  runId: string;
  onSelect?: (pointId: string) => void;
}

export function PointHoverCard({ point, runId, onSelect }: PointHoverCardProps) {
  if (!point) {
    return (
      <Card className="bg-slate-950/50">
        <CardHeader>
          <CardTitle>Point hover preview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Hover a sparse map point to preview its observation count and linked evidence.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950/50">
      <CardHeader>
        <CardTitle>{point.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted">
        <p>{point.observationCount} linked observations</p>
        <p>Mean reprojection: {point.meanReprojectionError !== undefined ? `${formatNumber(point.meanReprojectionError)} px` : "n/a"}</p>
        <p>
          XYZ: {point.xyz.map((value) => formatNumber(value)).join(", ")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => onSelect?.(point.id)} className="border-accent/50">
            Focus point
          </Button>
          <Link href={`/results/${runId}/correspondences`} className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
            Open correspondence view
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
