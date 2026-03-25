import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RunArtifact } from "@/src/types/run";

interface ExportPanelProps {
  artifacts: RunArtifact[];
}

export function ExportPanel({ artifacts }: ExportPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {artifacts.map((artifact) => (
          <Link
            key={artifact.label}
            href={artifact.href}
            className="flex items-center justify-between rounded-xl border border-border bg-slate-950/40 px-3 py-3 text-sm text-slate-200 transition hover:border-accent/50"
          >
            <span>{artifact.label}</span>
            <span className="text-muted">{artifact.kind}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
