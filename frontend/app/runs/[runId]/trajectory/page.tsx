import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { PointCloud3DViewer } from "@/components/viewers/pointcloud-3d-viewer";
import { Trajectory2DViewer } from "@/components/viewers/trajectory-2d-viewer";
import { StatCard } from "@/components/common/stat-card";
import { getRunDetails } from "@/src/lib/api/runs";

export default async function RunTrajectoryPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRunDetails(runId);
  if (!run) {
    notFound();
  }

  return (
    <AppShell title="Trajectory & Map">
      <SectionHeader
        eyebrow="Motion Over Time"
        title={`${run.name} trajectory and sparse map`}
        description="Switch between top-down motion, point cloud structure, and keyframe anchors to understand how the run evolved."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Trajectory Samples" value={run.trajectory2D.length} />
        <StatCard label="Keyframe Positions" value={run.keyframePositions.length} />
        <StatCard label="Sparse Point Preview" value={run.pointCloudPreview.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Trajectory2DViewer trajectory={run.trajectory2D} keyframes={run.keyframePositions} />
        <PointCloud3DViewer points={run.pointCloudPreview} trajectory={run.trajectory2D} />
      </div>
    </AppShell>
  );
}
