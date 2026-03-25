"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { DatasetSelector } from "@/components/new-run/dataset-selector";
import { QualityPresetSelector } from "@/components/new-run/quality-preset-selector";
import { RunConfigForm } from "@/components/new-run/run-config-form";
import { RunProgressPanel } from "@/components/new-run/run-progress-panel";
import { UploadPanel } from "@/components/new-run/upload-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRun } from "@/src/lib/api/create-run";
import { getDatasets } from "@/src/lib/api/datasets";
import { useRunProgress } from "@/src/hooks/use-run-progress";
import type { RunRequest } from "@/src/types/run-request";
import type { DatasetSummary } from "@/src/types/summary";

const DEFAULT_REQUEST: RunRequest = {
  inputType: "dataset",
  datasetId: "kitti-demo",
  detector: "orb",
  usePnP: true,
  useBundleAdjustment: false,
  maxFrames: 50,
  qualityPreset: "balanced"
};

export default function NewRunPage() {
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [request, setRequest] = useState<RunRequest>(DEFAULT_REQUEST);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const progress = useRunProgress(activeRunId);

  useEffect(() => {
    void getDatasets().then(setDatasets);
  }, []);

  async function handleStartRun(): Promise<void> {
    setIsStarting(true);
    const response = await createRun(request);
    setActiveRunId(response.runId);
    setIsStarting(false);
  }

  return (
    <AppShell title="New Run">
      <SectionHeader
        eyebrow="Launch Processing"
        title="Choose input, configure the important controls, and start a new reconstruction run."
        description="Demo mode simulates the full run lifecycle so the product can show launch, progress, and finished results before the backend API is connected."
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Input source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <DatasetSelector
                datasets={datasets}
                selectedId={request.datasetId}
                onSelect={(datasetId) => setRequest({ ...request, inputType: "dataset", datasetId })}
              />
              <UploadPanel
                fileName={request.fileName}
                onFileNameChange={(fileName) => setRequest({ ...request, inputType: "video", fileName })}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Run configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <RunConfigForm request={request} onChange={setRequest} />
              <QualityPresetSelector
                value={request.qualityPreset}
                onChange={(qualityPreset) => setRequest({ ...request, qualityPreset })}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3. Start run</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted">
              <p>
                Selected input:{" "}
                <span className="text-slate-100">
                  {datasets.find((dataset) => dataset.id === request.datasetId)?.name ??
                    request.fileName ??
                    "Not selected"}
                </span>
              </p>
              <p>
                Detector: <span className="text-slate-100">{request.detector.toUpperCase()}</span>
              </p>
              <p>
                Quality preset: <span className="text-slate-100">{request.qualityPreset}</span>
              </p>
              <Button
                type="button"
                onClick={() => void handleStartRun()}
                disabled={isStarting || (!request.datasetId && !request.fileName)}
                className="w-full border-accent/50 bg-accent/10 text-accent"
              >
                {isStarting ? "Starting..." : "Start Run"}
              </Button>
            </CardContent>
          </Card>
          {progress ? <RunProgressPanel progress={progress} /> : null}
        </div>
      </div>
    </AppShell>
  );
}
