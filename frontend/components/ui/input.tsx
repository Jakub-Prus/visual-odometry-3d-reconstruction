import { cn } from "@/src/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-border bg-slate-950/70 px-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-muted focus:border-accent/60",
        className
      )}
      {...props}
    />
  );
}
