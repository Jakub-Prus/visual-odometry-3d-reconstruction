import { ExperimentComparisonChart } from "@/components/charts/experiment-comparison-chart";
import { TrajectoryErrorChart } from "@/components/charts/trajectory-error-chart";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { ConfigComparisonPanel } from "@/components/experiments/config-comparison-panel";
import { ExperimentResultCard } from "@/components/experiments/experiment-result-card";
import { ExperimentsTable } from "@/components/experiments/experiments-table";
import { getExperiments } from "@/src/lib/api/experiments";

export default async function ExperimentsPage() {
  const experiments = await getExperiments();

  return (
    <AppShell title="Experiments">
      <SectionHeader
        eyebrow="Comparative Analysis"
        title="Experiment comparison and ablation results"
        description="Compare detector choice, PnP usage, reprojection error, and trajectory quality to show engineering iteration."
      />
      <div className="grid gap-6 xl:grid-cols-3">
        {experiments.map((experiment) => (
          <ExperimentResultCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ExperimentComparisonChart experiments={experiments} />
        <ConfigComparisonPanel />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <TrajectoryErrorChart experiments={experiments} />
        <ExperimentsTable experiments={experiments} />
      </div>
    </AppShell>
  );
}
