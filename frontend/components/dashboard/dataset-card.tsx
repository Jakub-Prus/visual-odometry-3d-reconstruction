import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatasetCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Surface</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted">
        <p>The demo UI is wired around a KITTI-style sequence with synthetic placeholder assets for public deployment.</p>
        <p>Swap to API mode later to stream real frame metrics, trajectory files, and debug overlays from the Python backend.</p>
      </CardContent>
    </Card>
  );
}
