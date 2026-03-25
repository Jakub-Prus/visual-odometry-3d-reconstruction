import Image from "next/image";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFailureCases } from "@/src/lib/api/diagnostics";

export default async function FailuresPage() {
  const failures = await getFailureCases();

  return (
    <AppShell title="Failure Cases">
      <SectionHeader
        eyebrow="Known Limits"
        title="Failure scenarios and mitigation paths"
        description="A technical inventory of cases that degrade monocular odometry, why they matter, and how the system responds."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {failures.map((failure) => (
          <Card key={failure.id}>
            <CardHeader>
              <CardTitle>{failure.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image src={failure.imageUrl} alt={failure.title} width={960} height={540} className="h-auto w-full object-cover" />
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p><span className="font-medium text-white">Symptom:</span> {failure.symptom}</p>
                <p><span className="font-medium text-white">Why it happens:</span> {failure.whyItHappens}</p>
                <p><span className="font-medium text-white">System response:</span> {failure.systemResponse}</p>
                <p><span className="font-medium text-white">Mitigation:</span> {failure.mitigation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
