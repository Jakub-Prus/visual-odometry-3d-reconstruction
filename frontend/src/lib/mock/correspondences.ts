import type { RunFrame } from "@/src/types/frame";
import type { SequenceFrame } from "@/src/types/frame-sequence";
import type { MapPointDetails } from "@/src/types/point";

export const DEMO_IMAGE_WIDTH = 960;
export const DEMO_IMAGE_HEIGHT = 540;

const POINT_TEMPLATES: MapPointDetails[] = [
  {
    id: "p_0001",
    xyz: [0.35, 0.12, 4.3],
    meanReprojectionError: 0.82,
    observationCount: 4,
    isValid: true,
    observations: [
      { frameId: 0, imageX: 246, imageY: 194, isKeyframe: true, reprojectionError: 0.8 },
      { frameId: 3, imageX: 262, imageY: 200, reprojectionError: 0.9 },
      { frameId: 5, imageX: 276, imageY: 205, isKeyframe: true, reprojectionError: 0.86 },
      { frameId: 8, imageX: 298, imageY: 214, reprojectionError: 0.72 }
    ]
  },
  {
    id: "p_0008",
    xyz: [-0.24, 0.08, 5.1],
    meanReprojectionError: 1.04,
    observationCount: 3,
    isValid: true,
    observations: [
      { frameId: 1, imageX: 512, imageY: 236, reprojectionError: 1.1 },
      { frameId: 4, imageX: 494, imageY: 244, isKeyframe: true, reprojectionError: 0.94 },
      { frameId: 7, imageX: 476, imageY: 252, reprojectionError: 1.08 }
    ]
  },
  {
    id: "p_0014",
    xyz: [0.88, -0.16, 6.4],
    meanReprojectionError: 0.74,
    observationCount: 5,
    isValid: true,
    observations: [
      { frameId: 2, imageX: 692, imageY: 178, reprojectionError: 0.79 },
      { frameId: 4, imageX: 676, imageY: 186, isKeyframe: true, reprojectionError: 0.76 },
      { frameId: 6, imageX: 660, imageY: 194, reprojectionError: 0.71 },
      { frameId: 8, imageX: 644, imageY: 204, reprojectionError: 0.74 },
      { frameId: 10, imageX: 628, imageY: 214, isKeyframe: true, reprojectionError: 0.7 }
    ]
  },
  {
    id: "p_0021",
    xyz: [-0.68, -0.22, 5.8],
    meanReprojectionError: 1.22,
    observationCount: 4,
    isValid: true,
    observations: [
      { frameId: 3, imageX: 358, imageY: 308, reprojectionError: 1.3 },
      { frameId: 5, imageX: 338, imageY: 316, isKeyframe: true, reprojectionError: 1.18 },
      { frameId: 7, imageX: 318, imageY: 324, reprojectionError: 1.17 },
      { frameId: 9, imageX: 300, imageY: 332, reprojectionError: 1.21 }
    ]
  },
  {
    id: "p_0033",
    xyz: [0.14, 0.36, 3.9],
    meanReprojectionError: 0.68,
    observationCount: 4,
    isValid: true,
    observations: [
      { frameId: 0, imageX: 432, imageY: 132, isKeyframe: true, reprojectionError: 0.64 },
      { frameId: 2, imageX: 446, imageY: 140, reprojectionError: 0.7 },
      { frameId: 4, imageX: 460, imageY: 146, isKeyframe: true, reprojectionError: 0.68 },
      { frameId: 6, imageX: 474, imageY: 154, reprojectionError: 0.69 }
    ]
  },
  {
    id: "p_0042",
    xyz: [-1.12, 0.12, 7.1],
    meanReprojectionError: 1.35,
    observationCount: 3,
    isValid: true,
    observations: [
      { frameId: 6, imageX: 192, imageY: 226, reprojectionError: 1.28 },
      { frameId: 8, imageX: 176, imageY: 232, reprojectionError: 1.41 },
      { frameId: 10, imageX: 162, imageY: 238, isKeyframe: true, reprojectionError: 1.36 }
    ]
  },
  {
    id: "p_0051",
    xyz: [0.52, -0.44, 8.0],
    meanReprojectionError: 0.96,
    observationCount: 4,
    isValid: true,
    observations: [
      { frameId: 5, imageX: 584, imageY: 352, isKeyframe: true, reprojectionError: 0.91 },
      { frameId: 7, imageX: 568, imageY: 346, reprojectionError: 1.02 },
      { frameId: 9, imageX: 552, imageY: 338, reprojectionError: 0.95 },
      { frameId: 11, imageX: 536, imageY: 330, reprojectionError: 0.94 }
    ]
  }
];

function cloneMapPoints(): MapPointDetails[] {
  return POINT_TEMPLATES.map((point) => ({
    ...point,
    xyz: [...point.xyz] as [number, number, number],
    observations: point.observations.map((observation) => ({ ...observation }))
  }));
}

export function buildSequenceFrames(frames: RunFrame[], mapPoints: MapPointDetails[]): SequenceFrame[] {
  const frameIds = Array.from(
    new Set([
      ...frames.slice(0, 12).map((frame) => frame.frameId),
      ...mapPoints.flatMap((point) => point.observations.map((observation) => observation.frameId))
    ])
  ).sort((left, right) => left - right);

  return frameIds.map((frameId, index) => {
    const frame = frames.find((candidate) => candidate.frameId === frameId) ?? frames[index % Math.max(frames.length, 1)];
    return {
      frameId,
      imageUrl: frame?.imageUrl ?? "/demo/images/frame-grid.svg",
      isKeyframe: frame?.keyframeInserted ?? frameId % 3 === 0,
      observedPointIds: mapPoints
        .filter((point) => point.observations.some((observation) => observation.frameId === frameId))
        .map((point) => point.id),
      timestamp: Number((frameId * 0.1).toFixed(2))
    };
  });
}

export function buildCorrespondenceBundle(frames: RunFrame[]): {
  imageWidth: number;
  imageHeight: number;
  defaultPointId?: string;
  mapPoints: MapPointDetails[];
  sequenceFrames: SequenceFrame[];
} {
  const mapPoints = cloneMapPoints();
  const sequenceFrames = buildSequenceFrames(frames, mapPoints);
  return {
    imageWidth: DEMO_IMAGE_WIDTH,
    imageHeight: DEMO_IMAGE_HEIGHT,
    defaultPointId: mapPoints[0]?.id,
    mapPoints,
    sequenceFrames
  };
}

export function buildEmptyCorrespondenceBundle(frames: RunFrame[]): {
  imageWidth: number;
  imageHeight: number;
  defaultPointId?: string;
  mapPoints: MapPointDetails[];
  sequenceFrames: SequenceFrame[];
} {
  return {
    imageWidth: DEMO_IMAGE_WIDTH,
    imageHeight: DEMO_IMAGE_HEIGHT,
    defaultPointId: undefined,
    mapPoints: [],
    sequenceFrames: buildSequenceFrames(frames, [])
  };
}
