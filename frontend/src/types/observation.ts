export interface PointObservation {
  frameId: number;
  imageX: number;
  imageY: number;
  isKeyframe?: boolean;
  reprojectionError?: number;
}
