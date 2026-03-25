import { Button } from "@/components/ui/button";
import { SequenceImageViewer } from "@/components/sequence/sequence-image-viewer";
import { ZoomedPointPreview } from "@/components/viewers/zoomed-point-preview";
import type { ObservationEntry } from "@/src/lib/utils/correspondence";
import type { SequenceFrame } from "@/src/types/frame-sequence";

interface ObservationImageViewerProps {
  frame?: SequenceFrame;
  observationEntry?: ObservationEntry;
  imageWidth: number;
  imageHeight: number;
  imageUrl?: string;
  observationsInFrame: ObservationEntry[];
  onPointSelect?: (pointId: string, frameId: number, observationIndex: number) => void;
  onPointHover?: (pointId?: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ObservationImageViewer({
  frame,
  observationEntry,
  imageWidth,
  imageHeight,
  imageUrl,
  observationsInFrame,
  onPointSelect,
  onPointHover,
  onPrevious,
  onNext
}: ObservationImageViewerProps) {
  if (!frame || !observationEntry || !imageUrl) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onPrevious}>
          Previous observation
        </Button>
        <Button type="button" onClick={onNext}>
          Next observation
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SequenceImageViewer
          title={`Frame ${frame.frameId} evidence`}
          imageUrl={imageUrl}
          observations={observationsInFrame}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          selectedPointId={observationEntry.point.id}
          onPointSelect={onPointSelect}
          onPointHover={onPointHover}
          showSelectedOnly={false}
          frameMeta={frame.isKeyframe ? "Keyframe observation" : "Tracked observation"}
        />
        <ZoomedPointPreview
          imageUrl={imageUrl}
          observation={observationEntry.observation}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      </div>
    </div>
  );
}
