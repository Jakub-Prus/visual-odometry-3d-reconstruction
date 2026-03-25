import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { severityColorMap } from "@/src/lib/utils/colors";
import type { WarningEvent } from "@/src/types/diagnostics";

export function WarningPanel({ warnings }: { warnings: WarningEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warnings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {warnings.map((warning) => (
          <div key={warning.id} className={`rounded-2xl border p-4 ${severityColorMap[warning.severity]}`}>
            <p className="font-medium">{warning.title}</p>
            <p className="mt-2 text-sm">{warning.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
