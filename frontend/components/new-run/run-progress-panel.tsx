import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RunProgress } from "@/src/types/progress";
import { formatDuration, formatPercent } from "@/src/lib/utils/format";

interface RunProgressPanelProps {
  progress: RunProgress;
}

export function RunProgressPanel({ progress }: RunProgressPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted">
            <span className="capitalize">{progress.stage}</span>
            <span>{formatPercent(progress.progressPercent)}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-950/80">
            <div className="h-3 rounded-full bg-accent transition-all" style={{ width: `${progress.progressPercent}%` }} />
          </div>
        </div>
        <div className="grid gap-3 text-sm text-muted md:grid-cols-3">
          <p>Status: <span className="text-slate-100">{progress.status}</span></p>
          <p>Frames: <span className="text-slate-100">{progress.currentFrame ?? 0} / {progress.totalFrames ?? "n/a"}</span></p>
          <p>Elapsed: <span className="text-slate-100">{formatDuration(progress.elapsedSec)}</span></p>
        </div>
        <p className="text-sm text-slate-200">{progress.message}</p>
        {progress.status === "completed" ? (
          <Link href={`/results/${progress.runId}`} className="inline-flex items-center rounded-xl border border-success/40 bg-success/10 px-4 py-2 text-sm font-medium text-success">
            Open Results
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
