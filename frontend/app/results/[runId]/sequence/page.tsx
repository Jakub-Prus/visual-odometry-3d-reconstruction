"use client";

import { useParams, usePathname } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { AppShell } from "@/components/layout/app-shell";
import { ResultSubnav } from "@/components/results/result-subnav";
import { SequenceBrowser } from "@/components/sequence/sequence-browser";
import { useInitializeResultViewer } from "@/src/hooks/use-initialize-result-viewer";
import { useResultDetails } from "@/src/hooks/use-result-details";

export default function ResultSequencePage() {
  const params = useParams<{ runId: string }>();
  const pathname = usePathname();
  const result = useResultDetails(params.runId);
  useInitializeResultViewer(result);

  if (!result) {
    return (
      <AppShell title="Sequence Browser">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell title="Sequence Browser">
      <ResultSubnav runId={result.id} activePath={pathname} />
      <SequenceBrowser result={result} />
    </AppShell>
  );
}
