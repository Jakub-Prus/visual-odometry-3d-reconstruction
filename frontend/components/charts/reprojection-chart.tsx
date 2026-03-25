"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FrameMetric } from "@/src/types/metrics";

export function ReprojectionChart({ metrics }: { metrics: FrameMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reprojection Error</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="frameId" stroke="#8b9bb7" />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Line type="monotone" dataKey="reprojectionError" stroke="#64d3ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
