import { cn } from "@/lib/utils";

interface VoteBarProps {
  label: string;
  count: number;
  total: number;
  isLeader?: boolean;
}

const barColors = ["bg-primary", "bg-accent", "bg-blue-400", "bg-green-400"];

export function VoteBar({ label, count, total, isLeader = false }: VoteBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className={cn("line-clamp-1 font-bold", isLeader && "text-accent")}>
          {isLeader ? "🏆 " : ""}
          {label}
        </span>
        <span className="shrink-0 font-bold text-muted-foreground">
          {count} suara · {pct}%
        </span>
      </div>
      <div className="h-6 w-full overflow-hidden rounded-sm border-2 border-neon-border bg-background">
        <div
          className={cn("h-full transition-all", barColors[count % barColors.length])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${count} suara`}
        />
      </div>
    </div>
  );
}
