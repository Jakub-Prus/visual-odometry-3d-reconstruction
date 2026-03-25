import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfigComparisonPanel() {
  const comparisons = [
    "ORB vs SIFT feature density and runtime trade-off",
    "PnP enabled vs essential-only pose sourcing",
    "Tighter reprojection threshold vs higher map retention"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Axes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted">
        {comparisons.map((comparison) => (
          <p key={comparison}>{comparison}</p>
        ))}
      </CardContent>
    </Card>
  );
}
