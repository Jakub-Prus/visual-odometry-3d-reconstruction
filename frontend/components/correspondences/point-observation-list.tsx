import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { MapPointDetails } from "@/src/types/point";
import { formatNumber } from "@/src/lib/utils/format";
import { cn } from "@/src/lib/utils";

interface PointObservationListProps {
  point: MapPointDetails;
  sequenceFrames: SequenceFrame[];
  activeObservationIndex: number;
  onSelectObservation: (observationIndex: number, frameId: number) => void;
}

export function PointObservationList({
  point,
  sequenceFrames,
  activeObservationIndex,
  onSelectObservation
}: PointObservationListProps) {
  return (
    <div className="space-y-3">
      {point.observations.map((observation, index) => {
        const frame = sequenceFrames.find((candidate) => candidate.frameId === observation.frameId);
        return (
          <button
            key={`${point.id}-${observation.frameId}-${index}`}
            type="button"
            onClick={() => onSelectObservation(index, observation.frameId)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
              activeObservationIndex === index
                ? "border-accent bg-accent/8"
                : "border-border bg-slate-950/35 hover:border-accent/40"
            )}
          >
            <div>
              <p className="font-medium text-slate-100">Frame {observation.frameId}</p>
              <p className="mt-1 text-sm text-muted">
                {frame?.isKeyframe ? "Keyframe" : "Tracked frame"} • ({formatNumber(observation.imageX, 0)}, {formatNumber(observation.imageY, 0)})
              </p>
            </div>
            <p className="text-sm text-muted">
              {observation.reprojectionError !== undefined ? `${formatNumber(observation.reprojectionError)} px` : "n/a"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
