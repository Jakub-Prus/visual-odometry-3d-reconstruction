import { cn } from "@/src/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-border bg-slate-950/70 px-3 text-sm text-slate-100 outline-none focus:border-accent/60",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
