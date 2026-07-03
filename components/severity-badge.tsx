import { cn } from "@/lib/utils";
import type { Severity, RiskLevel } from "@/lib/types";

const styles: Record<string, string> = {
  critical: "bg-danger/15 text-danger border-danger/30 dark:text-red-400",
  high: "bg-danger/10 text-danger border-danger/20 dark:text-red-400",
  medium: "bg-warning/15 text-amber-700 border-warning/30 dark:text-amber-400",
  low: "bg-muted text-muted-foreground border-border",
  minimal: "bg-success/15 text-emerald-700 border-success/30 dark:text-emerald-400",
};

const labels: Record<string, string> = {
  critical: "حرجة",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
  minimal: "طفيفة",
};

export function SeverityBadge({ value, className }: { value: Severity | RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        styles[value] ?? styles.low,
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-red-500": value === "critical" || value === "high",
          "bg-amber-500": value === "medium",
          "bg-slate-400": value === "low",
          "bg-emerald-500": value === "minimal",
        })}
      />
      {labels[value] ?? value}
    </span>
  );
}
