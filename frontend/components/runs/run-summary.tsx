import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/src/lib/utils/format";
import type { RunDetails } from "@/src/types/run";

interface RunSummaryProps {
  run: RunDetails;
}

export function RunSummary({ run }: RunSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Initialization</p>
          <p className="mt-2 text-sm text-slate-200">
            {run.summary.initialized ? "Seed map established from a valid baseline." : "Initialization did not complete."}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Mean Reprojection Error</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(run.summary.meanReprojectionError)} px</p>
        </div>
      </CardContent>
    </Card>
  );
}
