import { Badge } from "@/components/ui/badge";
import { cn } from "@/src/lib/utils";

interface ResultStatusBadgeProps {
  status: "completed" | "running" | "failed";
}

const STATUS_STYLES: Record<ResultStatusBadgeProps["status"], string> = {
  completed: "border-success/30 bg-success/10 text-success",
  running: "border-accent/30 bg-accent/10 text-accent",
  failed: "border-danger/30 bg-danger/10 text-danger"
};

export function ResultStatusBadge({ status }: ResultStatusBadgeProps) {
  return <Badge className={cn("capitalize", STATUS_STYLES[status])}>{status}</Badge>;
}
