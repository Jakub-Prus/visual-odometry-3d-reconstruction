"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { statusColorMap } from "@/src/lib/utils/colors";
import { formatDate } from "@/src/lib/utils/format";
import type { RunSummary } from "@/src/types/run";

interface RunsBrowserProps {
  runs: RunSummary[];
}

type SortKey = "createdAt" | "mapPoints" | "totalFrames";

export function RunsBrowser({ runs }: RunsBrowserProps) {
  const [query, setQuery] = useState("");
  const [datasetFilter, setDatasetFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detectorFilter, setDetectorFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");

  const datasets = Array.from(new Set(runs.map((run) => run.dataset)));
  const detectors = Array.from(new Set(runs.map((run) => run.detector)));

  const filteredRuns = useMemo(() => {
    return [...runs]
      .filter((run) => run.name.toLowerCase().includes(query.toLowerCase()))
      .filter((run) => datasetFilter === "all" || run.dataset === datasetFilter)
      .filter((run) => statusFilter === "all" || run.status === statusFilter)
      .filter((run) => detectorFilter === "all" || run.detector === detectorFilter)
      .sort((left, right) => {
        if (sortKey === "createdAt") {
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        }
        return right[sortKey] - left[sortKey];
      });
  }, [datasetFilter, detectorFilter, query, runs, sortKey, statusFilter]);

  return (
    <Card>
      <CardHeader className="gap-4">
        <CardTitle>Runs Explorer</CardTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search run name" />
          <Select value={datasetFilter} onChange={(event) => setDatasetFilter(event.target.value)}>
            <option value="all">All datasets</option>
            {datasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
          </Select>
          <Select value={detectorFilter} onChange={(event) => setDetectorFilter(event.target.value)}>
            <option value="all">All detectors</option>
            {detectors.map((detector) => (
              <option key={detector} value={detector}>
                {detector}
              </option>
            ))}
          </Select>
          <Select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="createdAt">Newest first</option>
            <option value="mapPoints">Map points</option>
            <option value="totalFrames">Frame count</option>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead>
            <tr>
              <TH>Run name</TH>
              <TH>Dataset</TH>
              <TH>Detector</TH>
              <TH>Frames</TH>
              <TH>Keyframes</TH>
              <TH>Map points</TH>
              <TH>Status</TH>
              <TH>Created</TH>
            </tr>
          </THead>
          <TBody>
            {filteredRuns.map((run) => (
              <tr key={run.id} className="transition hover:bg-white/5">
                <TD>
                  <Link href={`/runs/${run.id}`} className="font-medium text-white hover:text-accent">
                    {run.name}
                  </Link>
                </TD>
                <TD>{run.dataset}</TD>
                <TD>{run.detector}</TD>
                <TD>{run.totalFrames}</TD>
                <TD>{run.keyframes}</TD>
                <TD>{run.mapPoints}</TD>
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
