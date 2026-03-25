"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtifactImage } from "@/src/types/artifact";

interface ArtifactGalleryProps {
  images: ArtifactImage[];
  title: string;
  description?: string;
}

export function ArtifactGallery({ images, title, description }: ArtifactGalleryProps) {
  const [activeId, setActiveId] = useState(images[0]?.id);
  const active = useMemo(() => images.find((image) => image.id === activeId) ?? images[0], [activeId, images]);

  if (!active) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image src={active.imageUrl} alt={active.label} fill className="object-cover" />
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveId(image.id)}
              className={`rounded-2xl border p-3 text-left text-sm ${active.id === image.id ? "border-accent bg-accent/8" : "border-border bg-slate-950/35"}`}
            >
              <p className="font-medium text-slate-100">{image.label}</p>
              <p className="mt-1 capitalize text-muted">{image.category}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
