"use client";

import { useState } from "react";

import { PointCloud3DViewer } from "@/components/viewers/pointcloud-3d-viewer";
import { Button } from "@/components/ui/button";

interface PointCloudHeroViewerProps {
  points: Array<{ x: number; y: number; z: number }>;
  trajectory: Array<{ x: number; y: number; z?: number }>;
}

export function PointCloudHeroViewer({ points, trajectory }: PointCloudHeroViewerProps) {
  const [showPoints, setShowPoints] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setShowPoints((value) => !value)} className={showPoints ? "border-accent/60" : ""}>
          {showPoints ? "Hide sparse points" : "Show sparse points"}
        </Button>
        <Button type="button" onClick={() => setShowTrajectory((value) => !value)} className={showTrajectory ? "border-accent/60" : ""}>
          {showTrajectory ? "Hide trajectory" : "Show trajectory"}
        </Button>
      </div>
      <PointCloud3DViewer points={showPoints ? points : []} trajectory={showTrajectory ? trajectory : []} />
    </div>
  );
}
