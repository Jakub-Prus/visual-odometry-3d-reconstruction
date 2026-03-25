"use client";

import { Trajectory2DViewer } from "@/components/viewers/trajectory-2d-viewer";

interface TrajectoryHeroViewerProps {
  trajectory: Array<{ x: number; y: number; z?: number }>;
  keyframes?: Array<{ frameId: number; x: number; z: number }>;
}

export function TrajectoryHeroViewer({ trajectory, keyframes }: TrajectoryHeroViewerProps) {
  return <Trajectory2DViewer trajectory={trajectory} keyframes={keyframes} />;
}
