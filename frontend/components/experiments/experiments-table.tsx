import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import type { ExperimentResult } from "@/src/types/experiment";

export function ExperimentsTable({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiments Table</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Detector</TH>
              <TH>PnP</TH>
              <TH>Mean Reproj.</TH>
              <TH>ATE</TH>
              <TH>Runtime</TH>
            </tr>
          </THead>
          <TBody>
            {experiments.map((experiment) => (
              <tr key={experiment.id}>
                <TD>{experiment.name}</TD>
                <TD>{experiment.detector}</TD>
                <TD>{experiment.usesPnP ? "yes" : "no"}</TD>
                <TD>{experiment.meanReprojectionError}</TD>
                <TD>{experiment.ate ?? "n/a"}</TD>
                <TD>{experiment.runtimeSec ?? "n/a"} s</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
