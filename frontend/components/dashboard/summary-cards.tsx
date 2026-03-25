import { StatCard } from "@/components/common/stat-card";

interface SummaryCardsProps {
  totalRuns: number;
  meanReprojectionError: number;
  keyframes: number;
  mapPoints: number;
}

export function SummaryCards({
  totalRuns,
  meanReprojectionError,
  keyframes,
  mapPoints
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Runs" value={totalRuns} hint="Demo plus failure probes" />
      <StatCard label="Latest Mean Reprojection Error" value={meanReprojectionError} hint="px over accepted map support" />
      <StatCard label="Latest Keyframes" value={keyframes} hint="Stored local-map anchors" />
      <StatCard label="Latest Map Points" value={mapPoints} hint="Sparse 3D structure retained" />
    </div>
  );
}
