export interface SequenceFrame {
  frameId: number;
  imageUrl: string;
  isKeyframe: boolean;
  observedPointIds: string[];
  timestamp?: number;
}
