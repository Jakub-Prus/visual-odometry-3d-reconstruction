import { cn } from "@/src/lib/utils";
import type { RunRequest } from "@/src/types/run-request";

interface QualityPresetSelectorProps {
  value: RunRequest["qualityPreset"];
  onChange: (value: RunRequest["qualityPreset"]) => void;
}

const PRESETS: Array<{ value: RunRequest["qualityPreset"]; label: string; description: string }> = [
  { value: "fast", label: "Fast", description: "Shorter demo runs with lighter processing." },
  { value: "balanced", label: "Balanced", description: "Default portfolio mode with stable visuals and diagnostics." },
  { value: "accurate", label: "Accurate", description: "Favor stronger tracking and denser sparse-map growth." }
];

export function QualityPresetSelector({ value, onChange }: QualityPresetSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onChange(preset.value)}
          className={cn(
            "rounded-2xl border p-4 text-left transition",
            value === preset.value ? "border-accent bg-accent/8" : "border-border bg-slate-950/35 hover:border-accent/40"
          )}
        >
          <div className="text-sm font-semibold text-white">{preset.label}</div>
          <p className="mt-2 text-sm text-muted">{preset.description}</p>
        </button>
      ))}
    </div>
  );
}
