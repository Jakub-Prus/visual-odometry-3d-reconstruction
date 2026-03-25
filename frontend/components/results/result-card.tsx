import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { ResultStatusBadge } from "@/components/results/result-status-badge";
import type { ResultSummary } from "@/src/types/summary";
import { formatDate, formatNumber } from "@/src/lib/utils/format";

interface ResultCardProps {
  result: ResultSummary;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/8] border-b border-border">
        <Image
          src={result.previewImage ?? "/demo/images/trajectory-plot.svg"}
          alt={result.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{result.dataset}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{result.name}</h3>
          </div>
          <ResultStatusBadge status={result.status} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-muted">
          <p>Keyframes: <span className="text-slate-100">{result.keyframes}</span></p>
          <p>Map points: <span className="text-slate-100">{result.mapPoints}</span></p>
          <p>Mean reprojection: <span className="text-slate-100">{result.meanReprojectionError ? formatNumber(result.meanReprojectionError) : "pending"}</span></p>
          <p>Date: <span className="text-slate-100">{formatDate(result.createdAt)}</span></p>
        </div>
        <Link
          href={`/results/${result.id}`}
          className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-accent/60"
        >
          Open Result
        </Link>
      </CardContent>
    </Card>
  );
}
