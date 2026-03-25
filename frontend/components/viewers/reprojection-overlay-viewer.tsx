import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReprojectionOverlayViewerProps {
  imageUrl: string;
}

export function ReprojectionOverlayViewer({ imageUrl }: ReprojectionOverlayViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reprojection Overlay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-border">
          <Image src={imageUrl} alt="Reprojection overlay" width={960} height={540} className="h-auto w-full object-cover" />
        </div>
      </CardContent>
    </Card>
  );
}
