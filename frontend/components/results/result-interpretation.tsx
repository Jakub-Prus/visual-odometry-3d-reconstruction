import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultInterpretationProps {
  interpretation: string[];
}

export function ResultInterpretation({ interpretation }: ResultInterpretationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interpretation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted">
        {interpretation.map((entry) => (
          <p key={entry} className="rounded-2xl border border-border/70 bg-slate-950/35 px-4 py-3 text-slate-200">
            {entry}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
