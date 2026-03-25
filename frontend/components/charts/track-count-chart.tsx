"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FrameMetric } from "@/src/types/metrics";

export function TrackCountChart({ metrics }: { metrics: FrameMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracked Points</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="frameId" stroke="#8b9bb7" />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Area type="monotone" dataKey="numTrackedPoints" stroke="#ffb561" fill="rgba(255,181,97,0.25)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
