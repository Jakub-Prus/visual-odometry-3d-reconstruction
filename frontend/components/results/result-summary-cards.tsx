import { StatCard } from "@/components/common/stat-card";
import type { ResultDetails } from "@/src/types/result";

interface ResultSummaryCardsProps {
  result: ResultDetails;
}

export function ResultSummaryCards({ result }: ResultSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Processed Frames" value={result.summary.processedFrames} hint={`${result.summary.totalFrames} total`} />
      <StatCard label="Keyframes" value={result.summary.keyframes} />
      <StatCard label="Map Points" value={result.summary.mapPoints} />
      <StatCard label="Mean Reprojection" value={result.summary.meanReprojectionError ?? "pending"} />
      <StatCard label="ATE / RPE" value={result.summary.ate !== undefined ? `${result.summary.ate.toFixed(2)} / ${result.summary.rpe?.toFixed(2) ?? "n/a"}` : "n/a"} />
    </div>
  );
}
