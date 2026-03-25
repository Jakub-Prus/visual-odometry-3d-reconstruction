"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FrameMetric } from "@/src/types/metrics";

export function InlierChart({ metrics }: { metrics: FrameMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inlier Support</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="frameId" stroke="#8b9bb7" />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Bar dataKey="numInliers" fill="#6de5a1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
