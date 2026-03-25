import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { RunsBrowser } from "@/components/runs/runs-browser";
import { getRuns } from "@/src/lib/api/runs";

export default async function RunsPage() {
  const runs = await getRuns();

  return (
    <AppShell title="Runs">
      <SectionHeader
        eyebrow="Runs Index"
        title="Inspect completed, running, and failed sessions"
        description="Search by name, filter by dataset and detector, and jump straight into run-specific diagnostics."
      />
      <RunsBrowser runs={runs} />
    </AppShell>
  );
}
