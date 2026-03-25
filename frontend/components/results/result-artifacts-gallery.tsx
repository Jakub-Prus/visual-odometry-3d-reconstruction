import { ArtifactGallery } from "@/components/viewers/artifact-gallery";
import type { ArtifactImage } from "@/src/types/artifact";

interface ResultArtifactsGalleryProps {
  images: ArtifactImage[];
}

export function ResultArtifactsGallery({ images }: ResultArtifactsGalleryProps) {
  return <ArtifactGallery images={images} title="Best Visual Outputs" description="Representative overlays and result snapshots from the completed run." />;
}
