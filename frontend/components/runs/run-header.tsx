import { BadgeRow } from "@/components/common/badge-row";
import { SectionHeader } from "@/components/layout/section-header";
import type { RunDetails } from "@/src/types/run";

interface RunHeaderProps {
  run: RunDetails;
}

export function RunHeader({ run }: RunHeaderProps) {
  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Run Overview"
        title={run.name}
        description="Single-run command center for config, geometry, diagnostics, and generated artifacts."
      />
      <BadgeRow
        items={[
          run.dataset,
          run.detector,
          run.matcher,
          run.status,
          run.summary.initialized ? "initialized" : "not initialized"
        ]}
      />
    </div>
  );
}
