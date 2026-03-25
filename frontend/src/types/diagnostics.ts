export interface WarningEvent {
  id: string;
  severity: "info" | "warning" | "error";
  frameId?: number;
  title: string;
  description: string;
}

export interface FallbackEvent {
  id: string;
  frameId: number;
  from: "pnp";
  to: "fallback";
  reason: string;
}

export interface FailureCase {
  id: string;
  title: string;
  imageUrl: string;
  symptom: string;
  whyItHappens: string;
  systemResponse: string;
  mitigation: string;
}
