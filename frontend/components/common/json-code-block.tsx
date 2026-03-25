interface JsonCodeBlockProps {
  data: Record<string, unknown>;
}

export function JsonCodeBlock({ data }: JsonCodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-border bg-slate-950/80 p-4 text-xs text-slate-200">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
