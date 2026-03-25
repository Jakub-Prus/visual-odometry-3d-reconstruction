import Link from "next/link";

import { cn } from "@/src/lib/utils";

interface ResultSubnavProps {
  runId: string;
  activePath: string;
}

const LINKS = [
  { href: "", label: "Overview" },
  { href: "/map", label: "Map" },
  { href: "/sequence", label: "Sequence" },
  { href: "/correspondences", label: "Correspondences" },
  { href: "/visuals", label: "Visuals" },
  { href: "/metrics", label: "Metrics" },
  { href: "/details", label: "Technical Details" }
];

export function ResultSubnav({ runId, activePath }: ResultSubnavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const href = `/results/${runId}${link.href}`;
        const active = activePath === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm text-slate-200 transition",
              active ? "border-accent bg-accent/10" : "border-border bg-slate-950/40 hover:border-accent/50"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
