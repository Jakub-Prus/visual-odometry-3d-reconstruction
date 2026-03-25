import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { FrameTimeline } from "@/components/viewers/frame-timeline";
import { FeatureMatchViewer } from "@/components/viewers/feature-match-viewer";
import { ImageFrameViewer } from "@/components/viewers/image-frame-viewer";
import { ReprojectionOverlayViewer } from "@/components/viewers/reprojection-overlay-viewer";
import { getRunDetails } from "@/src/lib/api/runs";

export default async function RunFramesPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRunDetails(runId);
  if (!run) {
    notFound();
  }

  return (
    <AppShell title="Frame Inspection">
      <SectionHeader
        eyebrow="Frame-Level Inspection"
        title={`Inspect ${run.name} frame evolution`}
        description="Toggle source, feature, match, and reprojection overlays while reviewing frame-specific metadata and pose sourcing."
      />
      <ImageFrameViewer frames={run.frames} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <FeatureMatchViewer imageUrl={run.frames[0].matchOverlayUrl ?? run.frames[0].imageUrl} />
        <ReprojectionOverlayViewer imageUrl={run.frames[0].reprojectionOverlayUrl ?? run.frames[0].imageUrl} />
      </div>
      <FrameTimeline metrics={run.metricsByFrame} />
    </AppShell>
  );
}
