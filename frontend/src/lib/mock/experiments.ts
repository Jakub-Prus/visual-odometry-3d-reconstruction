import type { ExperimentResult } from "@/src/types/experiment";

export const experimentResults: ExperimentResult[] = [
  {
    id: "exp-orb-pnp",
    name: "ORB + PnP Local Map",
    detector: "ORB",
    usesPnP: true,
    usesBundleAdjustment: false,
    meanReprojectionError: 0.91,
    ate: 0.34,
    rpe: 0.08,
    runtimeSec: 4.8,
    notes: "Best overall balance for the bundled demo sequence."
  },
  {
    id: "exp-orb-essential",
    name: "ORB Essential-Only",
    detector: "ORB",
    usesPnP: false,
    usesBundleAdjustment: false,
    meanReprojectionError: 1.62,
    ate: 0.57,
    rpe: 0.14,
    runtimeSec: 3.9,
    notes: "Simpler but drifts earlier as map support drops."
  },
  {
    id: "exp-sift-pnp",
    name: "SIFT + PnP Probe",
    detector: "SIFT",
    usesPnP: true,
    usesBundleAdjustment: false,
    meanReprojectionError: 0.78,
    ate: 0.29,
    rpe: 0.07,
    runtimeSec: 8.1,
    notes: "Cleaner geometry at a higher compute cost."
  }
];
