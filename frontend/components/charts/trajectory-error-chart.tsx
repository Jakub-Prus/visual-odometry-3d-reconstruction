"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperimentResult } from "@/src/types/experiment";

export function TrajectoryErrorChart({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATE / RPE Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={experiments}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="#8b9bb7" interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Line type="monotone" dataKey="ate" stroke="#64d3ff" strokeWidth={2} />
            <Line type="monotone" dataKey="rpe" stroke="#6de5a1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
