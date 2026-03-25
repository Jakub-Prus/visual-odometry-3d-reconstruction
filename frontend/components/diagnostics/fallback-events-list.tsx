import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FallbackEvent } from "@/src/types/diagnostics";

export function FallbackEventsList({ events }: { events: FallbackEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fallback Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-border bg-slate-950/40 p-4">
            <p className="text-sm font-medium text-white">Frame {event.frameId}</p>
            <p className="mt-2 text-sm text-muted">{event.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
