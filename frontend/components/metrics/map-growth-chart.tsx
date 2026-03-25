"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FrameMetric } from "@/src/types/metrics";

interface MapGrowthChartProps {
  metrics: FrameMetric[];
}

export function MapGrowthChart({ metrics }: MapGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map growth over time</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="frameId" stroke="#8b9bb7" />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Line type="monotone" dataKey="mapPoints" stroke="#ffb561" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
