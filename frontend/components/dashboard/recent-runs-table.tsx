import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { statusColorMap } from "@/src/lib/utils/colors";
import { formatDate } from "@/src/lib/utils/format";
import type { RunSummary } from "@/src/types/run";

interface RecentRunsTableProps {
  runs: RunSummary[];
}

export function RecentRunsTable({ runs }: RecentRunsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Runs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead>
            <tr>
              <TH>Run</TH>
              <TH>Dataset</TH>
              <TH>Detector</TH>
              <TH>Frames</TH>
              <TH>Status</TH>
              <TH>Created</TH>
            </tr>
          </THead>
          <TBody>
            {runs.map((run) => (
              <tr key={run.id} className="transition hover:bg-white/5">
                <TD>
                  <Link href={`/runs/${run.id}`} className="font-medium text-white hover:text-accent">
                    {run.name}
                  </Link>
                </TD>
                <TD>{run.dataset}</TD>
                <TD>{run.detector}</TD>
                <TD>{run.totalFrames}</TD>
                <TD>
                  <Badge className={statusColorMap[run.status]}>{run.status}</Badge>
                </TD>
                <TD>{formatDate(run.createdAt)}</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
