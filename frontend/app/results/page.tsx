"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { ResultCard } from "@/components/results/result-card";
import { ResultStatusBadge } from "@/components/results/result-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { getResults } from "@/src/lib/api/results";
import { formatDate, formatNumber } from "@/src/lib/utils/format";
import type { ResultSummary } from "@/src/types/summary";

type ViewMode = "grid" | "table";
type SortMode = "newest" | "best-reprojection" | "most-map-points" | "successful-only";

export default function ResultsPage() {
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  useEffect(() => {
    void getResults().then(setResults);
  }, []);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let next = results.filter((result) => {
      if (!normalizedQuery) {
        return true;
      }
      return [result.name, result.dataset, result.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    });

    if (sortMode === "successful-only") {
      next = next.filter((result) => result.status === "completed");
    }

    return [...next].sort((left, right) => {
      if (sortMode === "best-reprojection") {
        return (left.meanReprojectionError ?? Number.POSITIVE_INFINITY) -
          (right.meanReprojectionError ?? Number.POSITIVE_INFINITY);
      }
      if (sortMode === "most-map-points") {
        return right.mapPoints - left.mapPoints;
      }
      return right.createdAt.localeCompare(left.createdAt);
    });
  }, [query, results, sortMode]);

  return (
    <AppShell title="Results">
      <SectionHeader
        eyebrow="Processed Outputs"
        title="Browse completed and in-progress reconstruction results."
        description="The results gallery emphasizes previews, key quality indicators, and quick access to the final trajectory and sparse map."
      />
      <Card>
        <CardContent className="flex flex-col gap-4 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by run name, dataset, or status"
            />
            <Select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="md:max-w-xs"
            >
              <option value="newest">Newest</option>
              <option value="best-reprojection">Best reprojection error</option>
              <option value="most-map-points">Most map points</option>
              <option value="successful-only">Successful only</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "border-accent/60" : ""}>
              Grid
            </Button>
            <Button type="button" onClick={() => setViewMode("table")} className={viewMode === "table" ? "border-accent/60" : ""}>
              Table
            </Button>
          </div>
        </CardContent>
      </Card>
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Results table</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <THead>
                <tr>
                  <TH>Run</TH>
                  <TH>Dataset</TH>
                  <TH>Status</TH>
                  <TH>Keyframes</TH>
                  <TH>Map points</TH>
                  <TH>Mean reprojection</TH>
                  <TH>Created</TH>
                </tr>
              </THead>
              <TBody>
                {filteredResults.map((result) => (
                  <tr key={result.id}>
                    <TD>
                      <Link href={`/results/${result.id}`} className="font-medium text-white hover:text-accent">
                        {result.name}
                      </Link>
                    </TD>
                    <TD>{result.dataset}</TD>
                    <TD>
                      <ResultStatusBadge status={result.status} />
                    </TD>
                    <TD>{result.keyframes}</TD>
                    <TD>{result.mapPoints}</TD>
                    <TD>{result.meanReprojectionError !== undefined ? formatNumber(result.meanReprojectionError) : "pending"}</TD>
                    <TD>{formatDate(result.createdAt)}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
