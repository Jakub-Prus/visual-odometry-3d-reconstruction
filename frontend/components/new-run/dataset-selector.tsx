import type { DatasetSummary } from "@/src/types/summary";
import { cn } from "@/src/lib/utils";

interface DatasetSelectorProps {
  datasets: DatasetSummary[];
  selectedId?: string;
  onSelect: (datasetId: string) => void;
}

export function DatasetSelector({ datasets, selectedId, onSelect }: DatasetSelectorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {datasets.map((dataset) => {
        const selected = dataset.id === selectedId;
        return (
          <button
            key={dataset.id}
            type="button"
            onClick={() => onSelect(dataset.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              selected ? "border-accent bg-accent/8" : "border-border bg-slate-950/35 hover:border-accent/50"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">{dataset.name}</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">{dataset.source}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{dataset.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
              {dataset.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border/80 px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
