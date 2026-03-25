import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PointObservation } from "@/src/types/observation";

interface ZoomedPointPreviewProps {
  imageUrl: string;
  observation: PointObservation;
  imageWidth: number;
  imageHeight: number;
}

export function ZoomedPointPreview({
  imageUrl,
  observation,
  imageWidth,
  imageHeight
}: ZoomedPointPreviewProps) {
  const xPercent = (observation.imageX / imageWidth) * 100;
  const yPercent = (observation.imageY / imageHeight) * 100;

  return (
    <Card className="bg-slate-950/50">
      <CardHeader>
        <CardTitle>Zoomed observation</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-slate-950/60"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `${xPercent}% ${yPercent}%`,
            backgroundSize: "250% 250%"
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-warning shadow-[0_0_0_14px_rgba(255,181,97,0.16)]" />
            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
