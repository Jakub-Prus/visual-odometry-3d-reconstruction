export interface ExperimentResult {
  id: string;
  name: string;
  detector: string;
  usesPnP: boolean;
  usesBundleAdjustment: boolean;
  meanReprojectionError: number;
  ate?: number;
  rpe?: number;
  runtimeSec?: number;
  notes?: string;
}
