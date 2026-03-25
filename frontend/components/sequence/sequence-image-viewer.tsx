import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ObservationEntry } from "@/src/lib/utils/correspondence";
import { ImageOverlayLayer } from "@/components/sequence/image-overlay-layer";

interface SequenceImageViewerProps {
  title?: string;
  imageUrl: string;
  observations: ObservationEntry[];
  imageWidth: number;
  imageHeight: number;
  selectedPointId?: string;
  hoveredPointId?: string;
  onPointSelect?: (pointId: string, frameId: number, observationIndex: number) => void;
  onPointHover?: (pointId?: string) => void;
  showSelectedOnly?: boolean;
  frameMeta?: string;
}

export function SequenceImageViewer({
  title = "Frame view",
  imageUrl,
  observations,
  imageWidth,
  imageHeight,
  selectedPointId,
  hoveredPointId,
  onPointSelect,
  onPointHover,
  showSelectedOnly = false,
  frameMeta
}: SequenceImageViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {frameMeta ? <p className="text-sm text-muted">{frameMeta}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <Image
            src={imageUrl}
            alt={title}
            width={imageWidth}
            height={imageHeight}
            className="h-auto w-full object-cover"
          />
          <ImageOverlayLayer
            observations={observations}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            selectedPointId={selectedPointId}
            hoveredPointId={hoveredPointId}
            onPointSelect={onPointSelect}
            onPointHover={onPointHover}
            showSelectedOnly={showSelectedOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
}
