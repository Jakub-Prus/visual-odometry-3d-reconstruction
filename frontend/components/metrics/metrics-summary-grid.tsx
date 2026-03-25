import { StatCard } from "@/components/common/stat-card";
import type { ResultDetails } from "@/src/types/result";

interface MetricsSummaryGridProps {
  result: ResultDetails;
}

export function MetricsSummaryGrid({ result }: MetricsSummaryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Mean Reprojection" value={result.summary.meanReprojectionError ?? "n/a"} />
      <StatCard label="Median Reprojection" value={result.summary.medianReprojectionError ?? "n/a"} />
      <StatCard label="ATE" value={result.summary.ate ?? "n/a"} />
      <StatCard label="RPE" value={result.summary.rpe ?? "n/a"} />
    </div>
  );
}
