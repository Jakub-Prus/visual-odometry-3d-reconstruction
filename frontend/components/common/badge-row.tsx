import { Badge } from "@/components/ui/badge";

interface BadgeRowProps {
  items: string[];
}

export function BadgeRow({ items }: BadgeRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}
