import Link from "next/link";

interface ResultActionsProps {
  runId: string;
}

export function ResultActions({ runId }: ResultActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/new-run" className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
        Rerun
      </Link>
      <Link href={`/results/${runId}/map`} className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
        Open Map
      </Link>
      <Link href={`/results/${runId}/details`} className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/60">
        Technical Details
      </Link>
    </div>
  );
}
