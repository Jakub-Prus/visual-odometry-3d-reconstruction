interface UploadPanelProps {
  fileName?: string;
  onFileNameChange: (value: string) => void;
}

export function UploadPanel({ fileName, onFileNameChange }: UploadPanelProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-slate-950/35 p-4">
      <h3 className="text-base font-semibold text-white">Upload-ready input path</h3>
      <p className="mt-2 text-sm text-muted">
        Demo mode does not upload files yet, but this form mirrors the future API contract for video or image-sequence ingestion.
      </p>
      <input
        value={fileName ?? ""}
        onChange={(event) => onFileNameChange(event.target.value)}
        placeholder="example: office_walk.mp4 or hallway_sequence.zip"
        className="mt-4 h-10 w-full rounded-xl border border-border bg-slate-950/70 px-3 text-sm text-slate-100 outline-none focus:border-accent/60"
      />
    </div>
  );
}
