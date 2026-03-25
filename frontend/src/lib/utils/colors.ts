export const statusColorMap = {
  completed: "text-background bg-success",
  running: "text-background bg-accent",
  failed: "text-background bg-danger"
} as const;

export const severityColorMap = {
  info: "text-accent border-accent/40 bg-accent/10",
  warning: "text-warning border-warning/40 bg-warning/10",
  error: "text-danger border-danger/40 bg-danger/10"
} as const;
