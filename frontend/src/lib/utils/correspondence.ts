import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { PointObservation } from "@/src/types/observation";
import type { MapPointDetails } from "@/src/types/point";

export interface ObservationEntry {
  point: MapPointDetails;
  observation: PointObservation;
  observationIndex: number;
}

export function getMapPointById(mapPoints: MapPointDetails[], pointId?: string): MapPointDetails | undefined {
  if (!pointId) {
    return undefined;
  }
  return mapPoints.find((point) => point.id === pointId);
}

export function getSequenceFrameById(sequenceFrames: SequenceFrame[], frameId?: number): SequenceFrame | undefined {
  if (frameId === undefined) {
    return undefined;
  }
  return sequenceFrames.find((frame) => frame.frameId === frameId);
}

export function findObservationIndexForFrame(point: MapPointDetails | undefined, frameId?: number): number {
  if (!point || frameId === undefined) {
    return 0;
  }
  const index = point.observations.findIndex((observation) => observation.frameId === frameId);
  return index >= 0 ? index : 0;
}

export function getSelectedObservation(
  mapPoints: MapPointDetails[],
  pointId?: string,
  observationIndex = 0
): ObservationEntry | undefined {
  const point = getMapPointById(mapPoints, pointId);
  if (!point || point.observations.length === 0) {
    return undefined;
  }
  const safeIndex = Math.min(Math.max(0, observationIndex), point.observations.length - 1);
  return {
    point,
    observation: point.observations[safeIndex],
    observationIndex: safeIndex
  };
}

export function getObservationsForFrame(mapPoints: MapPointDetails[], frameId?: number): ObservationEntry[] {
  if (frameId === undefined) {
    return [];
  }
  return mapPoints.flatMap((point) =>
    point.observations
      .map((observation, index) => ({ point, observation, observationIndex: index }))
      .filter((entry) => entry.observation.frameId === frameId)
  );
}

export function getFramesForPoint(sequenceFrames: SequenceFrame[], point: MapPointDetails | undefined): SequenceFrame[] {
  if (!point) {
    return [];
  }
  return point.observations
    .map((observation) => getSequenceFrameById(sequenceFrames, observation.frameId))
    .filter((frame): frame is SequenceFrame => frame !== undefined);
}
