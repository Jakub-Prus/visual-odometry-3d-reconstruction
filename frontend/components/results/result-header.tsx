import { ResultActions } from "@/components/results/result-actions";
import { ResultStatusBadge } from "@/components/results/result-status-badge";
import type { ResultDetails } from "@/src/types/result";
import { formatDate, formatDuration } from "@/src/lib/utils/format";

interface ResultHeaderProps {
  result: ResultDetails;
}

export function ResultHeader({ result }: ResultHeaderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-panel/70 p-6 shadow-panel lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Result Summary</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">{result.name}</h1>
          <ResultStatusBadge status={result.status} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <span>{result.dataset}</span>
          <span>{formatDate(result.createdAt)}</span>
          <span>{formatDuration(result.durationSec)}</span>
          <span>{result.poseMethod.toUpperCase()} pose flow</span>
        </div>
      </div>
      <ResultActions runId={result.id} />
    </div>
  );
}
