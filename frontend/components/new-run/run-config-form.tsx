import { Select } from "@/components/ui/select";
import type { RunRequest } from "@/src/types/run-request";

interface RunConfigFormProps {
  request: RunRequest;
  onChange: (next: RunRequest) => void;
}

export function RunConfigForm({ request, onChange }: RunConfigFormProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="space-y-2 text-sm text-muted">
        <span>Detector</span>
        <Select value={request.detector} onChange={(event) => onChange({ ...request, detector: event.target.value as RunRequest["detector"] })}>
          <option value="orb">ORB</option>
          <option value="sift">SIFT</option>
        </Select>
      </label>
      <label className="space-y-2 text-sm text-muted">
        <span>Max frames</span>
        <input
          type="number"
          min={10}
          step={10}
          value={request.maxFrames ?? 50}
          onChange={(event) => onChange({ ...request, maxFrames: Number(event.target.value) })}
          className="h-10 w-full rounded-xl border border-border bg-slate-950/70 px-3 text-sm text-slate-100 outline-none focus:border-accent/60"
        />
      </label>
      <label className="flex items-center justify-between rounded-2xl border border-border bg-slate-950/35 px-4 py-3 text-sm text-slate-200">
        <span>Enable PnP tracking</span>
        <input type="checkbox" checked={request.usePnP} onChange={(event) => onChange({ ...request, usePnP: event.target.checked })} className="h-4 w-4 accent-[#64d3ff]" />
      </label>
      <label className="flex items-center justify-between rounded-2xl border border-border bg-slate-950/35 px-4 py-3 text-sm text-slate-200">
        <span>Enable bundle adjustment</span>
        <input
          type="checkbox"
          checked={request.useBundleAdjustment}
          onChange={(event) => onChange({ ...request, useBundleAdjustment: event.target.checked })}
          className="h-4 w-4 accent-[#64d3ff]"
        />
      </label>
    </div>
  );
}
