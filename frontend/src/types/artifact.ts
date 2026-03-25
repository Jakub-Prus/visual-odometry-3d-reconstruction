export interface ArtifactImage {
  id: string;
  label: string;
  imageUrl: string;
  category: "input" | "matches" | "inliers" | "reprojection" | "keyframe" | "failure";
}

export interface ArtifactFile {
  id: string;
  label: string;
  fileUrl: string;
  kind: "image" | "json" | "pointcloud" | "log" | "config";
}
