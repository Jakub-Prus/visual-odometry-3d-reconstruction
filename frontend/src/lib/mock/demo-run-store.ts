import type { RunProgress } from "@/src/types/progress";
import type { RunRequest } from "@/src/types/run-request";

const STORAGE_KEY = "vo.demo.run.records";
const DEFAULT_TOTAL_FRAMES = 50;
const RUN_DURATION_SECONDS = 18;

interface ProgressStageDefinition {
  stage: RunProgress["stage"];
  maxPercent: number;
  label: string;
}

const PROGRESS_STAGES: ProgressStageDefinition[] = [
  { stage: "preparing", maxPercent: 8, label: "Preparing input bundle" },
  { stage: "initialization", maxPercent: 24, label: "Finding a valid initialization pair" },
  { stage: "tracking", maxPercent: 58, label: "Tracking camera motion and local map support" },
  { stage: "triangulation", maxPercent: 78, label: "Triangulating sparse map growth" },
  { stage: "optimization", maxPercent: 92, label: "Filtering reprojection outliers" },
  { stage: "finalizing", maxPercent: 100, label: "Writing outputs and previews" }
];

export interface DemoRunRecord {
  id: string;
  request: RunRequest;
  createdAt: string;
  datasetName: string;
  totalFrames: number;
  templateResultId: string;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRecords(): DemoRunRecord[] {
  if (!canUseStorage()) {
    return [];
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as DemoRunRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: DemoRunRecord[]): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function listDemoRunRecords(): DemoRunRecord[] {
  return readRecords().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getDemoRunRecord(runId: string): DemoRunRecord | null {
  return readRecords().find((record) => record.id === runId) ?? null;
}

export function createDemoRunRecord(request: RunRequest, datasetName: string, totalFrames = DEFAULT_TOTAL_FRAMES): DemoRunRecord {
  const record: DemoRunRecord = {
    id: `demo-${Date.now()}`,
    request,
    createdAt: new Date().toISOString(),
    datasetName,
    totalFrames,
    templateResultId: "kitti-seed-001"
  };
  const records = readRecords();
  records.unshift(record);
  writeRecords(records);
  return record;
}

export function getDemoRunProgress(record: DemoRunRecord): RunProgress {
  const elapsedSec = Math.max(
    0,
    Math.floor((Date.now() - new Date(record.createdAt).getTime()) / 1000)
  );
  const progressPercent = Math.min(100, Math.round((elapsedSec / RUN_DURATION_SECONDS) * 100));
  const status: RunProgress["status"] = progressPercent >= 100 ? "completed" : elapsedSec === 0 ? "queued" : "running";
  const stage =
    PROGRESS_STAGES.find((candidate) => progressPercent <= candidate.maxPercent) ?? PROGRESS_STAGES[PROGRESS_STAGES.length - 1];
  const completedFrames = Math.min(
    record.totalFrames,
    Math.max(0, Math.round((progressPercent / 100) * record.totalFrames))
  );

  return {
    runId: record.id,
    status,
    stage: stage.stage,
    progressPercent,
    currentFrame: completedFrames,
    totalFrames: record.totalFrames,
    elapsedSec,
    message: stage.label
  };
}
