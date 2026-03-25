import { cn } from "@/src/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-200",
        className
      )}
      {...props}
    />
  );
}
