import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperimentResult } from "@/src/types/experiment";

export function ExperimentResultCard({ experiment }: { experiment: ExperimentResult }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{experiment.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted">
        <p>Detector: <span className="text-white">{experiment.detector}</span></p>
        <p>Mean reprojection: <span className="text-white">{experiment.meanReprojectionError.toFixed(2)} px</span></p>
        <p>ATE / RPE: <span className="text-white">{experiment.ate ?? "n/a"} / {experiment.rpe ?? "n/a"}</span></p>
        <p>{experiment.notes}</p>
      </CardContent>
    </Card>
  );
}
