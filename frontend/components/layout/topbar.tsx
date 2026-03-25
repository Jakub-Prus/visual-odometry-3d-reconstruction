"use client";

import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const pathname = usePathname();
  const breadcrumb = pathname === "/" ? "overview" : pathname.split("/").filter(Boolean).join(" / ");

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-slate-950/70 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{breadcrumb}</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="border-success/30 bg-success/10 text-success">Demo Ready</Badge>
        <Badge className="border-accent/30 bg-accent/10 text-accent">API Adapter Prepared</Badge>
      </div>
    </div>
  );
}
