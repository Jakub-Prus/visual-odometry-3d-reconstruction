"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { ResultCard } from "@/components/results/result-card";
import { ResultStatusBadge } from "@/components/results/result-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PointCloudHeroViewer } from "@/components/viewers/pointcloud-hero-viewer";
import { TrajectoryHeroViewer } from "@/components/viewers/trajectory-hero-viewer";
import { getResultDetails, getResults } from "@/src/lib/api/results";
import type { ResultDetails } from "@/src/types/result";
import type { ResultSummary } from "@/src/types/summary";

export default function HomePage() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [spotlight, setSpotlight] = useState<ResultDetails | null>(null);

  useEffect(() => {
    async function load(): Promise<void> {
      const summaries = await getResults();
      setResults(summaries);
      const latestCompleted = summaries.find((result) => result.status === "completed");
      if (latestCompleted) {
        setSpotlight(await getResultDetails(latestCompleted.id));
      }
    }

    void load();
  }, []);

  return (
    <AppShell title="Home">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-border bg-panel/80 p-8 shadow-panel">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Results-first web UI</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white">
            Launch monocular visual odometry runs and review the final trajectory and sparse map first.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Select a dataset or future upload source, start processing, watch progress, and open a finished result
            that leads with camera motion, sparse reconstruction, and quality summary before optional diagnostics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/new-run"
              className="rounded-xl border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
            >
              Start New Run
            </Link>
            <Link
              href="/results"
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/50"
            >
              View Demo Results
            </Link>
          </div>
        </div>
        <Card className="bg-slate-950/60">
          <CardHeader>
            <CardTitle>Why this matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted">
            <p>Estimated camera path shows how the system recovers ego-motion from a monocular sequence.</p>
            <p>Sparse 3D reconstruction reveals the recovered scene structure from triangulated feature tracks.</p>
            <p>Run summaries surface whether initialization, tracking, and PnP-based pose updates stayed stable.</p>
          </CardContent>
        </Card>
      </div>

      <SectionHeader
        eyebrow="Recent Result Spotlight"
        title="Latest successful reconstruction"
        description="The first thing a visitor sees should be the final outcome: estimated path, sparse map, and a compact quality summary."
      />

      {!spotlight ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-panel/70 p-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">{spotlight.name}</h2>
                <ResultStatusBadge status={spotlight.status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {spotlight.dataset} • {spotlight.summary.keyframes} keyframes • {spotlight.summary.mapPoints} map points
              </p>
            </div>
            <Link
              href={`/results/${spotlight.id}`}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-100 hover:border-accent/50"
            >
              Open Result
            </Link>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <TrajectoryHeroViewer
              trajectory={spotlight.artifacts.trajectory2D ?? []}
              keyframes={spotlight.artifacts.keyframePositions}
            />
            <PointCloudHeroViewer
              points={spotlight.artifacts.pointCloudPreview ?? []}
              trajectory={spotlight.artifacts.trajectory2D ?? []}
            />
          </div>
        </div>
      )}

      <SectionHeader
        eyebrow="Recent Results"
        title="Processed outputs gallery"
        description="Browse recent completed or in-progress runs with a quick visual preview and the most important quality indicators."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.slice(0, 6).map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    </AppShell>
  );
}
