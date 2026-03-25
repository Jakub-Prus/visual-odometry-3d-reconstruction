import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="relative">
          <Topbar title={title} />
          <main className="space-y-8 bg-grid-glow px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
