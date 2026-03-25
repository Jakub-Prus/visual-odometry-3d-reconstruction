import { cn } from "@/src/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-border bg-slate-950/50 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
