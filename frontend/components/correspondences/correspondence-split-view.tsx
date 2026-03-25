"use client";

import { useMemo } from "react";

import { ObservationImageViewer } from "@/components/correspondences/observation-image-viewer";
import { PointInspectorPanel } from "@/components/correspondences/point-inspector-panel";
import { InteractivePointcloudViewer } from "@/components/viewers/interactive-pointcloud-viewer";
import { findObservationIndexForFrame, getMapPointById, getObservationsForFrame, getSelectedObservation, getSequenceFrameById } from "@/src/lib/utils/correspondence";
import { useResultViewerStore } from "@/src/stores/result-viewer-store";
import type { ResultDetails } from "@/src/types/result";

interface CorrespondenceSplitViewProps {
  result: ResultDetails;
}

export function CorrespondenceSplitView({ result }: CorrespondenceSplitViewProps) {
  const selectedPointId = useResultViewerStore((state) => state.selectedPointId);
  const hoveredPointId = useResultViewerStore((state) => state.hoveredPointId);
  const selectedFrameId = useResultViewerStore((state) => state.selectedFrameId);
  const selectedObservationIndex = useResultViewerStore((state) => state.selectedObservationIndex ?? 0);
  const hoverPoint = useResultViewerStore((state) => state.hoverPoint);
  const selectPoint = useResultViewerStore((state) => state.selectPoint);
  const selectFrame = useResultViewerStore((state) => state.selectFrame);
  const setObservationIndex = useResultViewerStore((state) => state.selectObservationIndex);

  const selectedPoint = getMapPointById(result.correspondence.mapPoints, selectedPointId);
  const selectedObservation = getSelectedObservation(result.correspondence.mapPoints, selectedPointId, selectedObservationIndex);
  const frameId = selectedFrameId ?? selectedObservation?.observation.frameId;
  const frame = getSequenceFrameById(result.correspondence.sequenceFrames, frameId);
  const frameAsset = result.frames?.find((candidate) => candidate.frameId === frame?.frameId);
  const observationsInFrame = useMemo(
    () => getObservationsForFrame(result.correspondence.mapPoints, frame?.frameId),
    [frame?.frameId, result.correspondence.mapPoints]
  );

  function stepObservation(direction: -1 | 1): void {
    if (!selectedPoint || selectedPoint.observations.length === 0) {
      return;
    }
    const nextIndex = (selectedObservationIndex + direction + selectedPoint.observations.length) % selectedPoint.observations.length;
    const nextObservation = selectedPoint.observations[nextIndex];
    setObservationIndex(nextIndex);
    selectFrame(nextObservation.frameId);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.1fr_0.95fr]">
      <InteractivePointcloudViewer
        title="Select a point in 3D"
        mapPoints={result.correspondence.mapPoints}
        trajectory={result.artifacts.trajectory2D ?? []}
        selectedPointId={selectedPointId}
        hoveredPointId={hoveredPointId}
        onPointHover={hoverPoint}
        onPointSelect={(pointId) => {
          const point = getMapPointById(result.correspondence.mapPoints, pointId);
          const nextFrameId = point?.observations[0]?.frameId;
          selectPoint(pointId, nextFrameId, 0);
          selectFrame(nextFrameId);
        }}
      />
      <ObservationImageViewer
        frame={frame}
        observationEntry={selectedObservation}
        imageWidth={result.correspondence.imageWidth}
        imageHeight={result.correspondence.imageHeight}
        imageUrl={frameAsset?.imageUrl ?? frame?.imageUrl}
        observationsInFrame={observationsInFrame}
        onPointHover={hoverPoint}
        onPointSelect={(pointId, pointFrameId, observationIndex) => {
          selectPoint(pointId, pointFrameId, observationIndex);
          selectFrame(pointFrameId);
          setObservationIndex(observationIndex);
        }}
        onPrevious={() => stepObservation(-1)}
        onNext={() => stepObservation(1)}
      />
      <PointInspectorPanel
        runId={result.id}
        point={selectedPoint}
        sequenceFrames={result.correspondence.sequenceFrames}
        activeObservationIndex={findObservationIndexForFrame(selectedPoint, frame?.frameId)}
        onSelectObservation={(observationIndex, pointFrameId) => {
          setObservationIndex(observationIndex);
          selectFrame(pointFrameId);
        }}
      />
    </div>
  );
}
