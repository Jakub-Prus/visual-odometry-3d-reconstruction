"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Trajectory2DViewerProps {
  trajectory: Array<{ x: number; y: number; z?: number }>;
  keyframes?: Array<{ frameId: number; x: number; z: number }>;
}

export function Trajectory2DViewer({ trajectory, keyframes = [] }: Trajectory2DViewerProps) {
  const chartData = trajectory.map((point, index) => ({
    index,
    x: point.x,
    z: point.z ?? point.y
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>2D Trajectory</CardTitle>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="x" stroke="#8b9bb7" />
            <YAxis dataKey="z" stroke="#8b9bb7" />
            <Tooltip />
            <Line type="monotone" dataKey="z" stroke="#64d3ff" dot={false} strokeWidth={2} />
            <Scatter data={keyframes.map((point) => ({ x: point.x, z: point.z }))} fill="#6de5a1" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
