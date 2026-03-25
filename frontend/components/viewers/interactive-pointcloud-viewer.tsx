"use client";

import { useMemo } from "react";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import type { MapPointDetails } from "@/src/types/point";

interface InteractivePointcloudViewerProps {
  title?: string;
  mapPoints: MapPointDetails[];
  trajectory: Array<{ x: number; y: number; z?: number }>;
  selectedPointId?: string;
  hoveredPointId?: string;
  onPointHover?: (pointId?: string) => void;
  onPointSelect?: (pointId?: string) => void;
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

function MapPointMesh({
  point,
  selected,
  hovered,
  onPointHover,
  onPointSelect
}: {
  point: MapPointDetails;
  selected: boolean;
  hovered: boolean;
  onPointHover?: (pointId?: string) => void;
  onPointSelect?: (pointId?: string) => void;
}) {
  const radius = selected ? 0.09 : hovered ? 0.07 : 0.045;
  const color = selected ? "#ffb561" : hovered ? "#f7fbff" : "#64d3ff";

  return (
    <mesh
      position={point.xyz}
      onPointerOver={(event) => {
        event.stopPropagation();
        onPointHover?.(point.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onPointHover?.(undefined);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onPointSelect?.(point.id);
      }}
    >
      <sphereGeometry args={[radius, 14, 14]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.55 : hovered ? 0.35 : 0.18} />
    </mesh>
  );
}

export function InteractivePointcloudViewer({
  title = "Interactive sparse map",
  mapPoints,
  trajectory,
  selectedPointId,
  hoveredPointId,
  onPointHover,
  onPointSelect
}: InteractivePointcloudViewerProps) {
  if (mapPoints.length === 0) {
    return (
      <EmptyState
        title="No correspondence-ready point cloud"
        description="This result does not expose point-level observation metadata."
      />
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[440px]">
        <Canvas camera={{ position: [0, 1.4, 4.8], fov: 50 }}>
          <ambientLight intensity={0.85} />
          <pointLight position={[3, 4, 5]} intensity={2} />
          <gridHelper args={[8, 8, "#26415e", "#122132"]} />
          <axesHelper args={[1.4]} />
          <TrajectoryLine trajectory={trajectory} />
          {mapPoints.slice(0, 220).map((point) => (
            <MapPointMesh
              key={point.id}
              point={point}
              selected={point.id === selectedPointId}
              hovered={point.id === hoveredPointId}
              onPointHover={onPointHover}
              onPointSelect={onPointSelect}
            />
          ))}
          <OrbitControls enablePan enableRotate enableZoom />
        </Canvas>
      </CardContent>
    </Card>
  );
}
