"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { getDatasets } from "@/src/lib/api/datasets";
import type { DatasetSummary } from "@/src/types/summary";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);

  useEffect(() => {
    void getDatasets().then(setDatasets);
  }, []);

  return (
    <AppShell title="Datasets">
      <SectionHeader
        eyebrow="Input Library"
        title="Available demo datasets and future upload-ready sources."
        description="Choose from curated sample sequences for a fast public demo, or prepare for API-backed uploads later."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {datasets.map((dataset) => (
          <Card key={dataset.id}>
            <CardContent className="space-y-4 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">{dataset.source}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{dataset.name}</h2>
                </div>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-slate-200">
                  {dataset.recommendedDetector.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted">{dataset.description}</p>
              <p className="text-sm text-muted">
                Frames: <span className="text-slate-100">{dataset.frameCount ?? "API dependent"}</span>
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {dataset.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border/80 px-2.5 py-1 text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/new-run"
                className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/50"
              >
                Use in new run
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
