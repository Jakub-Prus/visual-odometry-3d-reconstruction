import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PipelineStatusCard() {
  const stages = [
    "Bootstrap pair search",
    "Essential matrix pose recovery",
    "Seed triangulation",
    "Map point + keyframe insertion",
    "PnP tracking with fallback"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3 text-sm text-slate-200">
          {stages.map((stage, index) => (
            <li key={stage} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                {index + 1}
              </span>
              <span>{stage}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
