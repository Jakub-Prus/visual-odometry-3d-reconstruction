import type { SequenceFrame } from "@/src/types/frame-sequence";
import { SequenceFrameCard } from "@/components/sequence/sequence-frame-card";

interface FrameFilmstripProps {
  frames: SequenceFrame[];
  activeFrameId?: number;
  selectedPointId?: string;
  onSelectFrame: (frameId: number) => void;
}

export function FrameFilmstrip({
  frames,
  activeFrameId,
  selectedPointId,
  onSelectFrame
}: FrameFilmstripProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {frames.map((frame) => (
        <SequenceFrameCard
          key={frame.frameId}
          frame={frame}
          active={frame.frameId === activeFrameId}
          containsSelectedPoint={selectedPointId ? frame.observedPointIds.includes(selectedPointId) : false}
          onSelect={onSelectFrame}
        />
      ))}
    </div>
  );
}
