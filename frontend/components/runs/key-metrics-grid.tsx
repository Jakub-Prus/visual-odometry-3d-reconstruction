import { StatCard } from "@/components/common/stat-card";
import type { RunDetails } from "@/src/types/run";

interface KeyMetricsGridProps {
  run: RunDetails;
}

export function KeyMetricsGrid({ run }: KeyMetricsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Frames" value={run.summary.totalFrames} />
      <StatCard label="Keyframes" value={run.summary.keyframes} />
      <StatCard label="Map Points" value={run.summary.mapPoints} />
      <StatCard label="ATE / RPE" value={`${run.summary.ate ?? 0.34} / ${run.summary.rpe ?? 0.08}`} />
    </div>
  );
}
