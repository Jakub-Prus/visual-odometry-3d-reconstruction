"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperimentResult } from "@/src/types/experiment";

export function ExperimentComparisonChart({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mean Reprojection Error by Experiment</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={experiments}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="#8b9bb7" interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis stroke="#8b9bb7" />
            <Tooltip />
            <Bar dataKey="meanReprojectionError" fill="#64d3ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
