"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { RunProgressPanel } from "@/components/new-run/run-progress-panel";
import { ObservationImageViewer } from "@/components/correspondences/observation-image-viewer";
import { PointSelectionSummary } from "@/components/correspondences/point-selection-summary";
import { ResultArtifactsGallery } from "@/components/results/result-artifacts-gallery";
import { ResultHeader } from "@/components/results/result-header";
import { ResultInterpretation } from "@/components/results/result-interpretation";
import { ResultSubnav } from "@/components/results/result-subnav";
import { ResultSummaryCards } from "@/components/results/result-summary-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedTrajectoryMapViewer } from "@/components/viewers/linked-trajectory-map-viewer";
import { getMapPointById, getObservationsForFrame, getSelectedObservation, getSequenceFrameById } from "@/src/lib/utils/correspondence";
import { useInitializeResultViewer } from "@/src/hooks/use-initialize-result-viewer";
import { useResultDetails } from "@/src/hooks/use-result-details";
import { useRunProgress } from "@/src/hooks/use-run-progress";
import { useResultViewerStore } from "@/src/stores/result-viewer-store";

export default function ResultOverviewPage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId, 1000);
  const progress = useRunProgress(params.runId);
  const selectedPointId = useResultViewerStore((state) => state.selectedPointId);
  const selectedFrameId = useResultViewerStore((state) => state.selectedFrameId);
  const hoveredPointId = useResultViewerStore((state) => state.hoveredPointId);
  const hoverPoint = useResultViewerStore((state) => state.hoverPoint);
  const selectPoint = useResultViewerStore((state) => state.selectPoint);
  const selectFrame = useResultViewerStore((state) => state.selectFrame);
  const selectedObservationIndex = useResultViewerStore((state) => state.selectedObservationIndex ?? 0);
  const setObservationIndex = useResultViewerStore((state) => state.selectObservationIndex);
  useInitializeResultViewer(result);

  if (!result) {
    return (
      <AppShell title="Result">
        <LoadingState />
      </AppShell>
    );
  }

  const selectedPoint = getMapPointById(result.correspondence.mapPoints, selectedPointId ?? hoveredPointId);
  const selectedObservation = getSelectedObservation(
    result.correspondence.mapPoints,
    selectedPoint?.id,
    selectedObservationIndex
  );
  const activeFrameId = selectedFrameId ?? selectedObservation?.observation.frameId;
  const activeFrame = getSequenceFrameById(result.correspondence.sequenceFrames, activeFrameId);
  const frameAsset = result.frames?.find((frame) => frame.frameId === activeFrame?.frameId);
  const observationsInFrame = getObservationsForFrame(result.correspondence.mapPoints, activeFrame?.frameId);

  return (
    <AppShell title="Result Overview">
      <ResultHeader result={result} />
      <ResultSubnav runId={result.id} activePath={pathname} />
      {progress && progress.status !== "completed" ? <RunProgressPanel progress={progress} /> : null}
      <ResultSummaryCards result={result} />
      <LinkedTrajectoryMapViewer result={result} />
      <ResultArtifactsGallery images={result.artifacts.previewImages} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <PointSelectionSummary runId={result.id} point={selectedPoint} frame={activeFrame} />
        <ObservationImageViewer
          frame={activeFrame}
          observationEntry={selectedObservation}
          imageWidth={result.correspondence.imageWidth}
          imageHeight={result.correspondence.imageHeight}
          imageUrl={frameAsset?.imageUrl ?? activeFrame?.imageUrl}
          observationsInFrame={observationsInFrame}
          onPointHover={hoverPoint}
          onPointSelect={(pointId, frameId, observationIndex) => {
            selectPoint(pointId, frameId, observationIndex);
            selectFrame(frameId);
            setObservationIndex(observationIndex);
          }}
          onPrevious={() => {
            if (!selectedPoint || selectedPoint.observations.length === 0) {
              return;
            }
            const nextIndex = (selectedObservationIndex - 1 + selectedPoint.observations.length) % selectedPoint.observations.length;
            const nextObservation = selectedPoint.observations[nextIndex];
            setObservationIndex(nextIndex);
            selectFrame(nextObservation.frameId);
          }}
          onNext={() => {
            if (!selectedPoint || selectedPoint.observations.length === 0) {
              return;
            }
            const nextIndex = (selectedObservationIndex + 1) % selectedPoint.observations.length;
            const nextObservation = selectedPoint.observations[nextIndex];
            setObservationIndex(nextIndex);
            selectFrame(nextObservation.frameId);
          }}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ResultInterpretation interpretation={result.interpretation ?? []} />
        <Card>
          <CardHeader>
            <CardTitle>Open next</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Link href={`/results/${result.id}/map`} className="rounded-xl border border-border px-4 py-3 text-slate-100 hover:border-accent/50">
              Full map and trajectory view
            </Link>
            <Link href={`/results/${result.id}/visuals`} className="rounded-xl border border-border px-4 py-3 text-slate-100 hover:border-accent/50">
              Visual output gallery
            </Link>
            <Link href={`/results/${result.id}/metrics`} className="rounded-xl border border-border px-4 py-3 text-slate-100 hover:border-accent/50">
              Summary metrics
            </Link>
            <Link href={`/results/${result.id}/correspondences`} className="rounded-xl border border-border px-4 py-3 text-slate-100 hover:border-accent/50">
              Full correspondence view
            </Link>
            <Link href={`/results/${result.id}/details`} className="rounded-xl border border-border px-4 py-3 text-slate-100 hover:border-accent/50">
              Technical details
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
