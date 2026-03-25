import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompareImageViewerProps {
  leftLabel: string;
  leftImageUrl: string;
  rightLabel: string;
  rightImageUrl: string;
}

export function CompareImageViewer({ leftLabel, leftImageUrl, rightLabel, rightImageUrl }: CompareImageViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Side-by-side visual comparison</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {[
          [leftLabel, leftImageUrl],
          [rightLabel, rightImageUrl]
        ].map(([label, url]) => (
          <div key={label} className="space-y-3">
            <p className="text-sm font-medium text-slate-100">{label}</p>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <Image src={url} alt={label} fill className="object-cover" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
