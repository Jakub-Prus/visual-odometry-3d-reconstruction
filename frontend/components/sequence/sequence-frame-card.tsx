import Image from "next/image";

import { cn } from "@/src/lib/utils";
import type { SequenceFrame } from "@/src/types/frame-sequence";

interface SequenceFrameCardProps {
  frame: SequenceFrame;
  active: boolean;
  containsSelectedPoint: boolean;
  onSelect: (frameId: number) => void;
}

export function SequenceFrameCard({
  frame,
  active,
  containsSelectedPoint,
  onSelect
}: SequenceFrameCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(frame.frameId)}
      className={cn(
        "min-w-[168px] overflow-hidden rounded-2xl border text-left transition",
        active ? "border-accent bg-accent/8" : "border-border bg-panel/70 hover:border-accent/40",
        containsSelectedPoint && "shadow-[0_0_0_1px_rgba(255,181,97,0.3)]"
      )}
    >
      <div className="relative aspect-[16/9] border-b border-border">
        <Image src={frame.imageUrl} alt={`Frame ${frame.frameId}`} fill className="object-cover" />
      </div>
      <div className="space-y-2 px-3 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">Frame {frame.frameId}</span>
          {frame.isKeyframe ? (
            <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] text-success">
              Keyframe
            </span>
          ) : null}
        </div>
        <p className="text-muted">{frame.observedPointIds.length} linked points</p>
      </div>
    </button>
  );
}
