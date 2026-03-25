"use client";

import { useMemo } from "react";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";

interface PointCloud3DViewerProps {
  points: Array<{ x: number; y: number; z: number }>;
  trajectory: Array<{ x: number; y: number; z?: number }>;
}

function PointsCloud({ points }: { points: Array<{ x: number; y: number; z: number }> }) {
  const positions = useMemo(() => new Float32Array(points.flatMap((point) => [point.x, point.y, point.z])), [points]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#64d3ff" size={0.035} sizeAttenuation />
    </points>
  );
}

function TrajectoryLine({ trajectory }: { trajectory: Array<{ x: number; y: number; z?: number }> }) {
  const positions = useMemo(
    () => new Float32Array(trajectory.flatMap((point) => [point.x, point.y, point.z ?? 0])),
    [trajectory]
  );
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#6de5a1" linewidth={2} />
    </line>
  );
}

export function PointCloud3DViewer({ points, trajectory }: PointCloud3DViewerProps) {
  if (points.length === 0) {
    return <EmptyState title="No point cloud available" description="This run did not expose a sparse map artifact." />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Point Cloud + Camera Path</CardTitle>
      </CardHeader>
      <CardContent className="h-[420px]">
        <Canvas camera={{ position: [0, 1.5, 4.5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <gridHelper args={[8, 8, "#26415e", "#122132"]} />
          <axesHelper args={[1.5]} />
          <PointsCloud points={points} />
          <TrajectoryLine trajectory={trajectory} />
          <OrbitControls enablePan enableRotate enableZoom />
        </Canvas>
      </CardContent>
    </Card>
  );
}
