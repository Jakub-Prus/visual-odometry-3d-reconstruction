"use client";

import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { ResultSubnav } from "@/components/results/result-subnav";
import { ArtifactGallery } from "@/components/viewers/artifact-gallery";
import { CompareImageViewer } from "@/components/viewers/compare-image-viewer";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultVisualsPage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);

  if (!result) {
    return (
      <AppShell title="Visual Outputs">
        <LoadingState />
      </AppShell>
    );
  }

  const previewImages = result.artifacts.previewImages;

  return (
    <AppShell title="Visual Outputs">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <ArtifactGallery
        images={previewImages}
        title="Output visuals"
        description="Browse representative input frames, feature overlays, inlier views, reprojection checks, and keyframe snapshots."
      />
      {previewImages.length >= 2 ? (
        <CompareImageViewer
          leftLabel={previewImages[0].label}
          leftImageUrl={previewImages[0].imageUrl}
          rightLabel={previewImages[1].label}
          rightImageUrl={previewImages[1].imageUrl}
        />
      ) : null}
    </AppShell>
  );
}
