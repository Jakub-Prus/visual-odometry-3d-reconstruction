"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/src/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/new-run", label: "New Run" },
  { href: "/results", label: "Results" },
  { href: "/datasets", label: "Datasets" },
  { href: "/about", label: "About" }
];

const secondaryLinks = [
  { href: "/experiments", label: "Experiments" },
  { href: "/architecture", label: "Technical Details" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col border-r border-border bg-slate-950/80 px-4 py-6 backdrop-blur">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Monocular VO</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Results Studio</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-panel hover:text-white",
                active && "bg-panel text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Secondary</p>
        <div className="space-y-2">
          {secondaryLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-panel hover:text-white",
                  active && "bg-panel text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-auto rounded-2xl border border-border bg-panel/60 p-4 text-sm text-muted">
        Demo mode supports launching a mock run, tracking progress, and opening finished results. Switch `NEXT_PUBLIC_APP_MODE` to `api` when backend endpoints are ready.
      </div>
    </aside>
  );
}
