import Image from "next/image";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  {
    title: "Initialization",
    body: "Scan early frame pairs, reject weak baselines, recover a valid essential-matrix pose, and triangulate seed structure."
  },
  {
    title: "Triangulation",
    body: "Filter 3D points with positive-depth checks, reprojection thresholds, and parallax gates before insertion."
  },
  {
    title: "Mapping",
    body: "Store keyframes, map points, descriptors, and observation links so later frames can build 3D-2D correspondences."
  },
  {
    title: "PnP Tracking",
    body: "Estimate later poses from map support, then fall back to essential-matrix motion if inlier support weakens."
  }
];

export default function ArchitecturePage() {
  return (
    <AppShell title="Architecture">
      <SectionHeader
        eyebrow="System Explanation"
        title="Pipeline architecture and engineering flow"
        description="A recruiter-friendly and interviewer-friendly breakdown of how bootstrap, mapping, and tracking interact."
      />
      <div className="overflow-hidden rounded-3xl border border-border bg-panel/70">
        <Image src="/demo/images/architecture-diagram.svg" alt="Architecture diagram" width={1600} height={900} className="h-auto w-full" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {stages.map((stage) => (
          <Card key={stage.title}>
            <CardHeader>
              <CardTitle>{stage.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">{stage.body}</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Where bundle adjustment fits later</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Local or global optimization would sit after keyframe insertion and before long-term trajectory evaluation. The current frontend leaves this stage visible in the architecture without implying it is already implemented.
        </CardContent>
      </Card>
    </AppShell>
  );
}
