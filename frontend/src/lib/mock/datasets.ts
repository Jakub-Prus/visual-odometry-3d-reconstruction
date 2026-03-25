import type { DatasetSummary } from "@/src/types/summary";

export const demoDatasets: DatasetSummary[] = [
  {
    id: "kitti-demo",
    name: "KITTI Urban Drive",
    source: "demo",
    description: "Forward-driving stereo sequence adapted for monocular VO demo flow.",
    frameCount: 50,
    previewImage: "/demo/images/trajectory-plot.svg",
    recommendedDetector: "orb",
    tags: ["road", "baseline", "recommended"]
  },
  {
    id: "tum-room",
    name: "TUM RGB-D Room Sweep",
    source: "demo",
    description: "Indoor sequence with moderate camera motion and repeatable texture.",
    frameCount: 80,
    previewImage: "/demo/images/features-overlay.svg",
    recommendedDetector: "orb",
    tags: ["indoor", "handheld"]
  },
  {
    id: "euroc-machine-hall",
    name: "EuRoC Machine Hall",
    source: "demo",
    description: "Faster motion profile with stronger viewpoint change and more challenging tracking.",
    frameCount: 70,
    previewImage: "/demo/images/matches-overlay.svg",
    recommendedDetector: "sift",
    tags: ["aggressive", "flight"]
  },
  {
    id: "upload-sequence",
    name: "Upload Custom Sequence",
    source: "upload",
    description: "Future API path for uploaded video or zipped image sequences.",
    previewImage: "/demo/images/frame-grid-secondary.svg",
    recommendedDetector: "orb",
    tags: ["future", "upload-ready"]
  }
];
