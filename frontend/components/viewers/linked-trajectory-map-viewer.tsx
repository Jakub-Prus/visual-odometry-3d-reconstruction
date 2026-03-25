"use client";

import { useResultViewerStore } from "@/src/stores/result-viewer-store";
import type { ResultDetails } from "@/src/types/result";
import { TrajectoryHeroViewer } from "@/components/viewers/trajectory-hero-viewer";
import { InteractivePointcloudViewer } from "@/components/viewers/interactive-pointcloud-viewer";
import { PointHoverCard } from "@/components/correspondences/point-hover-card";
import { getMapPointById } from "@/src/lib/utils/correspondence";

interface LinkedTrajectoryMapViewerProps {
  result: ResultDetails;
}

export function LinkedTrajectoryMapViewer({ result }: LinkedTrajectoryMapViewerProps) {
  const selectedPointId = useResultViewerStore((state) => state.selectedPointId);
  const hoveredPointId = useResultViewerStore((state) => state.hoveredPointId);
  const hoverPoint = useResultViewerStore((state) => state.hoverPoint);
  const selectPoint = useResultViewerStore((state) => state.selectPoint);
  const hoveredPoint = getMapPointById(result.correspondence.mapPoints, hoveredPointId);
  const selectedPoint = getMapPointById(result.correspondence.mapPoints, selectedPointId);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <TrajectoryHeroViewer
        trajectory={result.artifacts.trajectory2D ?? []}
        keyframes={result.artifacts.keyframePositions}
      />
      <div className="space-y-4">
        <InteractivePointcloudViewer
          mapPoints={result.correspondence.mapPoints}
          trajectory={result.artifacts.trajectory2D ?? []}
          selectedPointId={selectedPointId}
          hoveredPointId={hoveredPointId}
          onPointHover={hoverPoint}
          onPointSelect={(pointId) =>
            selectPoint(pointId, getMapPointById(result.correspondence.mapPoints, pointId)?.observations[0]?.frameId)
          }
        />
        <PointHoverCard
          point={hoveredPoint ?? selectedPoint}
          runId={result.id}
          onSelect={(pointId) => selectPoint(pointId, getMapPointById(result.correspondence.mapPoints, pointId)?.observations[0]?.frameId)}
        />
      </div>
    </div>
  );
}
