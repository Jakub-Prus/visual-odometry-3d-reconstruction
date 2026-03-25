import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureMatchViewerProps {
  imageUrl: string;
}

export function FeatureMatchViewer({ imageUrl }: FeatureMatchViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Match Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-border">
          <Image src={imageUrl} alt="Feature matches" width={960} height={540} className="h-auto w-full object-cover" />
        </div>
      </CardContent>
    </Card>
  );
}
