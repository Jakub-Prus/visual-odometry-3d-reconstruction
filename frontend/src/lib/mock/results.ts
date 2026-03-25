import { buildCorrespondenceBundle, buildEmptyCorrespondenceBundle } from "@/src/lib/mock/correspondences";
import { getDemoRunProgress, getDemoRunRecord, listDemoRunRecords } from "@/src/lib/mock/demo-run-store";
import { demoDatasets } from "@/src/lib/mock/datasets";
import { runDetailsById, runSummaries } from "@/src/lib/mock/runs";
import type { ResultDetails } from "@/src/types/result";
import type { ResultSummary } from "@/src/types/summary";

function computeMedian(values: number[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2)) : sorted[middle];
}

function adaptSummary(runId: string): ResultSummary {
  const summary = runSummaries.find((candidate) => candidate.id === runId);
  const details = runDetailsById[runId];

  return {
    id: runId,
    name: details.name,
    dataset: details.dataset,
    status: details.status,
    createdAt: summary?.createdAt ?? new Date().toISOString(),
    durationSec: details.metricsByFrame ? details.metricsByFrame.length * 0.85 : undefined,
    keyframes: details.summary.keyframes,
    mapPoints: details.summary.mapPoints,
    meanReprojectionError: details.summary.meanReprojectionError,
    ate: details.summary.ate,
    rpe: details.summary.rpe,
    previewImage: details.frames?.[0]?.imageUrl ?? "/demo/images/frame-grid.svg"
  };
}

function adaptDetails(runId: string): ResultDetails {
  const details = runDetailsById[runId];
  const summary = runSummaries.find((candidate) => candidate.id === runId);
  const reprojectionValues = details.metricsByFrame
    .map((metric) => metric.reprojectionError)
    .filter((value): value is number => typeof value === "number");
  const previewImages = [
    {
      id: "artifact-input",
      label: "Input frame",
      imageUrl: details.frames?.[0]?.imageUrl ?? "/demo/images/frame-grid.svg",
      category: "input" as const
    },
    {
      id: "artifact-matches",
      label: "Feature matches",
      imageUrl: details.frames?.[1]?.matchOverlayUrl ?? "/demo/images/matches-overlay.svg",
      category: "matches" as const
    },
    {
      id: "artifact-inliers",
      label: "Inlier matches",
      imageUrl: "/demo/images/features-overlay.svg",
      category: "inliers" as const
    },
    {
      id: "artifact-reprojection",
      label: "Reprojection overlay",
      imageUrl: details.frames?.[2]?.reprojectionOverlayUrl ?? "/demo/images/reprojection-overlay.svg",
      category: "reprojection" as const
    },
    {
      id: "artifact-keyframe",
      label: "Selected keyframe",
      imageUrl: details.frames?.[4]?.featureOverlayUrl ?? "/demo/images/frame-grid-secondary.svg",
      category: "keyframe" as const
    }
  ];

  return {
    id: details.id,
    name: details.name,
    dataset: details.dataset,
    status: details.status,
    createdAt: summary?.createdAt ?? new Date().toISOString(),
    durationSec: details.metricsByFrame ? Number((details.metricsByFrame.length * 0.85).toFixed(1)) : undefined,
    detector: details.detector,
    matcher: details.matcher,
    poseMethod: details.metricsByFrame.some((metric) => metric.poseSource === "fallback") ? "mixed" : "pnp",
    summary: {
      initialized: details.summary.initialized,
      totalFrames: details.summary.totalFrames,
      processedFrames: details.metricsByFrame.length,
      keyframes: details.summary.keyframes,
      mapPoints: details.summary.mapPoints,
      meanReprojectionError: details.summary.meanReprojectionError,
      medianReprojectionError: computeMedian(reprojectionValues),
      ate: details.summary.ate,
      rpe: details.summary.rpe
    },
    artifacts: {
      trajectory2D: details.trajectory2D,
      pointCloudUrl: details.pointCloudAsset,
      previewImages,
      exportFiles: details.artifacts.map((artifact, index) => ({
        id: `${details.id}-export-${index}`,
        label: artifact.label,
        fileUrl: artifact.href,
        kind: artifact.kind === "pointcloud" ? "pointcloud" : artifact.kind === "log" ? "log" : artifact.kind === "json" ? "json" : "image"
      })),
      pointCloudPreview: details.pointCloudPreview,
      keyframePositions: details.keyframePositions
    },
    interpretation: [
      "Initialization succeeded from a non-adjacent frame pair after weak low-parallax pairs were skipped.",
      "Trajectory remained stable through the first half of the run with PnP support on most frames.",
      "Sparse mapping stayed lightweight and drift only became visible near the final section."
    ],
    metricsByFrame: details.metricsByFrame,
    warnings: details.warnings.map((warning) => ({
      ...warning,
      title: warning.title.replace("â†’", "->")
    })),
    config: details.config,
    frames: details.frames,
    correspondence:
      details.status === "failed"
        ? buildEmptyCorrespondenceBundle(details.frames)
        : buildCorrespondenceBundle(details.frames)
  };
}

function buildDynamicSummary(runId: string): ResultSummary | null {
  const record = getDemoRunRecord(runId);
  if (!record) {
    return null;
  }
  const progress = getDemoRunProgress(record);
  const template = adaptDetails(record.templateResultId);
  const dataset = demoDatasets.find((candidate) => candidate.id === record.request.datasetId);

  return {
    id: record.id,
    name: `${dataset?.name ?? record.datasetName} Run`,
    dataset: dataset?.name ?? record.datasetName,
    status: progress.status === "queued" ? "running" : progress.status,
    createdAt: record.createdAt,
    durationSec: progress.elapsedSec,
    keyframes: progress.status === "completed" ? template.summary.keyframes : Math.max(0, Math.floor((progress.currentFrame ?? 0) / 5)),
    mapPoints: progress.status === "completed" ? template.summary.mapPoints : Math.max(0, (progress.currentFrame ?? 0) * 2),
    meanReprojectionError: progress.status === "completed" ? template.summary.meanReprojectionError : undefined,
    ate: progress.status === "completed" ? template.summary.ate : undefined,
    rpe: progress.status === "completed" ? template.summary.rpe : undefined,
    previewImage: template.artifacts.previewImages[0]?.imageUrl
  };
}

function buildDynamicDetails(runId: string): ResultDetails | null {
  const record = getDemoRunRecord(runId);
  if (!record) {
    return null;
  }
  const progress = getDemoRunProgress(record);
  const template = adaptDetails(record.templateResultId);
  const dataset = demoDatasets.find((candidate) => candidate.id === record.request.datasetId);
  const processedFrames = progress.currentFrame ?? 0;
  const completed = progress.status === "completed";

  return {
    ...template,
    id: record.id,
    name: `${dataset?.name ?? record.datasetName} Demo Result`,
    dataset: dataset?.name ?? record.datasetName,
    status: completed ? "completed" : "running",
    createdAt: record.createdAt,
    durationSec: progress.elapsedSec,
    detector: record.request.detector.toUpperCase(),
    poseMethod: completed ? template.poseMethod : "mixed",
    summary: {
      ...template.summary,
      totalFrames: record.totalFrames,
      processedFrames,
      keyframes: completed ? template.summary.keyframes : Math.max(1, Math.floor(processedFrames / 5)),
      mapPoints: completed ? template.summary.mapPoints : Math.max(0, processedFrames * 2)
    },
    interpretation: completed
      ? template.interpretation
      : [
          "The run is still processing. Initialization and tracking updates are shown live in demo mode.",
          "Open the results page again after completion to review the full trajectory, sparse map, and export artifacts."
        ],
    metricsByFrame: completed ? template.metricsByFrame : template.metricsByFrame?.slice(0, Math.max(2, Math.floor(processedFrames / 2))),
    warnings: completed
      ? template.warnings
      : [
          {
            id: `${record.id}-progress`,
            severity: "info",
            title: "Run in progress",
            description: progress.message ?? "Processing frames."
          }
        ]
  };
}

export async function getMockResults(): Promise<ResultSummary[]> {
  const baseSummaries = Object.keys(runDetailsById).map(adaptSummary);
  const dynamicSummaries = listDemoRunRecords()
    .map((record) => buildDynamicSummary(record.id))
    .filter((value): value is ResultSummary => value !== null);

  return [...dynamicSummaries, ...baseSummaries].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getMockResultDetails(runId: string): Promise<ResultDetails | null> {
  if (runDetailsById[runId]) {
    return adaptDetails(runId);
  }
  return buildDynamicDetails(runId);
}
