"use client";

import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { CorrespondenceSplitView } from "@/components/correspondences/correspondence-split-view";
import { AppShell } from "@/components/layout/app-shell";
import { ResultSubnav } from "@/components/results/result-subnav";
import { useInitializeResultViewer } from "@/src/hooks/use-initialize-result-viewer";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultCorrespondencePage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);
  useInitializeResultViewer(result);

  if (!result) {
    return (
      <AppShell title="Correspondences">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell title="Correspondences">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <CorrespondenceSplitView result={result} />
    </AppShell>
  );
}
