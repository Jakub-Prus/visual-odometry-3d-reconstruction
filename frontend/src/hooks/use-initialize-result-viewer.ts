"use client";

import { useEffect } from "react";

import { useResultViewerStore } from "@/src/stores/result-viewer-store";
import type { ResultDetails } from "@/src/types/result";

export function useInitializeResultViewer(result: ResultDetails | null): void {
  const setRunContext = useResultViewerStore((state) => state.setRunContext);

  useEffect(() => {
    if (!result) {
      return;
    }
    const defaultPoint = result.correspondence.mapPoints.find(
      (point) => point.id === result.correspondence.defaultPointId
    );
    const defaultFrameId = defaultPoint?.observations[0]?.frameId ?? result.correspondence.sequenceFrames[0]?.frameId;

    setRunContext(result.id, {
      pointId: defaultPoint?.id,
      frameId: defaultFrameId,
      selectedObservationIndex: 0
    });
  }, [result, setRunContext]);
}
