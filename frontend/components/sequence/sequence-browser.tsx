"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrameFilmstrip } from "@/components/sequence/frame-filmstrip";
import { SequenceImageViewer } from "@/components/sequence/sequence-image-viewer";
import { findObservationIndexForFrame, getMapPointById, getObservationsForFrame, getSequenceFrameById } from "@/src/lib/utils/correspondence";
import { useResultViewerStore } from "@/src/stores/result-viewer-store";
import type { ResultDetails } from "@/src/types/result";

interface SequenceBrowserProps {
  result: ResultDetails;
}

export function SequenceBrowser({ result }: SequenceBrowserProps) {
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showFeatureOverlay, setShowFeatureOverlay] = useState(false);
  const [showReprojectionOverlay, setShowReprojectionOverlay] = useState(false);
  const selectedPointId = useResultViewerStore((state) => state.selectedPointId);
  const hoveredPointId = useResultViewerStore((state) => state.hoveredPointId);
  const selectedFrameId = useResultViewerStore((state) => state.selectedFrameId);
  const hoverPoint = useResultViewerStore((state) => state.hoverPoint);
  const selectPoint = useResultViewerStore((state) => state.selectPoint);
  const selectFrame = useResultViewerStore((state) => state.selectFrame);
  const selectObservationIndex = useResultViewerStore((state) => state.selectObservationIndex);
  const frameId = selectedFrameId ?? result.correspondence.sequenceFrames[0]?.frameId;
  const selectedFrame = getSequenceFrameById(result.correspondence.sequenceFrames, frameId);
  const selectedPoint = getMapPointById(result.correspondence.mapPoints, selectedPointId);

  const observationsInFrame = useMemo(
    () => getObservationsForFrame(result.correspondence.mapPoints, selectedFrame?.frameId),
    [result.correspondence.mapPoints, selectedFrame?.frameId]
  );

  const frameAsset = result.frames?.find((frame) => frame.frameId === selectedFrame?.frameId);
  const imageUrl = showReprojectionOverlay
    ? frameAsset?.reprojectionOverlayUrl ?? selectedFrame?.imageUrl
    : showFeatureOverlay
      ? frameAsset?.featureOverlayUrl ?? selectedFrame?.imageUrl
      : selectedFrame?.imageUrl;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sequence controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => setShowSelectedOnly((value) => !value)} className={showSelectedOnly ? "border-accent/60" : ""}>
            {showSelectedOnly ? "Show all observed points" : "Show selected point only"}
          </Button>
          <Button type="button" onClick={() => setShowFeatureOverlay((value) => !value)} className={showFeatureOverlay ? "border-accent/60" : ""}>
            {showFeatureOverlay ? "Hide keypoint overlay" : "Show keypoint overlay"}
          </Button>
          <Button type="button" onClick={() => setShowReprojectionOverlay((value) => !value)} className={showReprojectionOverlay ? "border-accent/60" : ""}>
            {showReprojectionOverlay ? "Hide reprojection overlay" : "Show reprojection overlay"}
          </Button>
        </CardContent>
      </Card>
      {selectedFrame && imageUrl ? (
        <SequenceImageViewer
          title={`Sequence frame ${selectedFrame.frameId}`}
          imageUrl={imageUrl}
          observations={observationsInFrame}
          imageWidth={result.correspondence.imageWidth}
          imageHeight={result.correspondence.imageHeight}
          selectedPointId={selectedPointId}
          hoveredPointId={hoveredPointId}
          showSelectedOnly={showSelectedOnly}
          onPointHover={hoverPoint}
          onPointSelect={(pointId, pointFrameId, observationIndex) => {
            selectPoint(pointId, pointFrameId, observationIndex);
            selectFrame(pointFrameId);
            selectObservationIndex(observationIndex);
          }}
          frameMeta={selectedFrame.isKeyframe ? "Keyframe" : "Tracked frame"}
        />
      ) : null}
      <FrameFilmstrip
        frames={result.correspondence.sequenceFrames}
        activeFrameId={selectedFrame?.frameId}
        selectedPointId={selectedPointId}
        onSelectFrame={(nextFrameId) => {
          selectFrame(nextFrameId);
          const nextObservationIndex = findObservationIndexForFrame(selectedPoint, nextFrameId);
          selectObservationIndex(nextObservationIndex);
        }}
      />
    </div>
  );
}
