import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell title="Not Found">
      <EmptyState title="Page not found" description="The requested run or route does not exist in the current demo dataset." />
      <Link href="/">
        <Button>Return to dashboard</Button>
      </Link>
    </AppShell>
  );
}
