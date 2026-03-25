"use client";

import { create } from "zustand";

import type { SelectedCorrespondence } from "@/src/types/correspondence";

interface ResultViewerState extends SelectedCorrespondence {
  activeRunId?: string;
  selectedPointId?: string;
  selectedFrameId?: number;
  hoveredPointId?: string;
  setRunContext: (runId: string, defaults?: SelectedCorrespondence) => void;
  selectPoint: (pointId?: string, frameId?: number, observationIndex?: number) => void;
  hoverPoint: (pointId?: string) => void;
  selectFrame: (frameId?: number) => void;
  selectObservationIndex: (selectedObservationIndex?: number) => void;
  clearSelection: () => void;
}

export const useResultViewerStore = create<ResultViewerState>((set) => ({
  activeRunId: undefined,
  selectedPointId: undefined,
  selectedFrameId: undefined,
  hoveredPointId: undefined,
  selectedObservationIndex: 0,
  setRunContext: (runId, defaults) =>
    set((state) => {
      if (state.activeRunId === runId) {
        return state;
      }
      return {
        activeRunId: runId,
        selectedPointId: defaults?.pointId,
        selectedFrameId: defaults?.frameId,
        selectedObservationIndex: defaults?.selectedObservationIndex ?? 0,
        hoveredPointId: undefined
      };
    }),
  selectPoint: (pointId, frameId, observationIndex) =>
    set({
      selectedPointId: pointId,
      selectedFrameId: frameId,
      selectedObservationIndex: observationIndex ?? 0
    }),
  hoverPoint: (pointId) => set({ hoveredPointId: pointId }),
  selectFrame: (frameId) => set({ selectedFrameId: frameId }),
  selectObservationIndex: (selectedObservationIndex) => set({ selectedObservationIndex }),
  clearSelection: () =>
    set({
      selectedPointId: undefined,
      selectedFrameId: undefined,
      hoveredPointId: undefined,
      selectedObservationIndex: 0
    })
}));
