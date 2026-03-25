import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <AppShell title="About">
      <SectionHeader
        eyebrow="Project Overview"
        title="Monocular visual odometry and sparse 3D reconstruction, packaged as a results-first demo application."
        description="The frontend is designed for portfolio presentation: launch a run, watch progress, then read the final trajectory and sparse reconstruction before optional technical drill-down."
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline stages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>Initialization finds a reliable frame pair with enough parallax to seed the map.</p>
            <p>Tracking estimates pose with PnP when 3D-2D support is strong and falls back to epipolar motion when needed.</p>
            <p>Sparse mapping grows the point cloud through triangulation and reprojection filtering.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What the app shows first</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>Estimated camera path.</p>
            <p>Sparse 3D reconstruction.</p>
            <p>Key result metrics and selected visual artifacts.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>Monocular scale remains ambiguous without extra sensors.</p>
            <p>Drift accumulates because loop closure and bundle adjustment are not active in the current backend.</p>
            <p>The public demo uses static assets and mock progress until the live API is connected.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
