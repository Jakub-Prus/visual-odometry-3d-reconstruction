import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonCodeBlock } from "@/components/common/json-code-block";

interface ConfigPanelProps {
  config: Record<string, unknown>;
}

export function ConfigPanel({ config }: ConfigPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <JsonCodeBlock data={config} />
      </CardContent>
    </Card>
  );
}
