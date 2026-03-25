import type { PointObservation } from "@/src/types/observation";

export interface MapPointDetails {
  id: string;
  xyz: [number, number, number];
  meanReprojectionError?: number;
  observationCount: number;
  isValid: boolean;
  observations: PointObservation[];
}
