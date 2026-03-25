import type { ObservationEntry } from "@/src/lib/utils/correspondence";
import { cn } from "@/src/lib/utils";

interface ImageOverlayLayerProps {
  observations: ObservationEntry[];
  imageWidth: number;
  imageHeight: number;
  selectedPointId?: string;
  hoveredPointId?: string;
  onPointSelect?: (pointId: string, frameId: number, observationIndex: number) => void;
  onPointHover?: (pointId?: string) => void;
  showSelectedOnly?: boolean;
}

export function ImageOverlayLayer({
  observations,
  imageWidth,
  imageHeight,
  selectedPointId,
  hoveredPointId,
  onPointSelect,
  onPointHover,
  showSelectedOnly = false
}: ImageOverlayLayerProps) {
  const visibleObservations = showSelectedOnly && selectedPointId
    ? observations.filter((entry) => entry.point.id === selectedPointId)
    : observations;

  return (
    <div className="pointer-events-none absolute inset-0">
      {visibleObservations.map((entry) => {
        const left = `${(entry.observation.imageX / imageWidth) * 100}%`;
        const top = `${(entry.observation.imageY / imageHeight) * 100}%`;
        const selected = entry.point.id === selectedPointId;
        const hovered = entry.point.id === hoveredPointId;

        return (
          <button
            key={`${entry.point.id}-${entry.observation.frameId}-${entry.observationIndex}`}
            type="button"
            onClick={() => onPointSelect?.(entry.point.id, entry.observation.frameId, entry.observationIndex)}
            onMouseEnter={() => onPointHover?.(entry.point.id)}
            onMouseLeave={() => onPointHover?.(undefined)}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left, top }}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/90 bg-accent/20 shadow-[0_0_0_8px_rgba(100,211,255,0.12)] transition",
                selected && "h-7 w-7 border-warning bg-warning/20 shadow-[0_0_0_12px_rgba(255,181,97,0.18)]",
                hovered && !selected && "h-6 w-6 bg-white/20"
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full bg-accent", selected && "bg-warning")} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
