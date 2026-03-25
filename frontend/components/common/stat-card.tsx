import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/src/lib/utils/format";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  const formattedValue = typeof value === "number" ? formatNumber(value, 0) : value;
  return (
    <Card className="bg-slate-950/55">
      <CardHeader className="border-none pb-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-semibold text-white">{formattedValue}</div>
        {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
