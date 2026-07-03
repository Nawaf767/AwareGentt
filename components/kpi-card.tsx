import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  tone = "default",
  invertDelta = false,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
  invertDelta?: boolean;
}) {
  const positive = (delta ?? 0) >= 0;
  const good = invertDelta ? !positive : positive;

  const toneStyles: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-emerald-600 dark:text-emerald-400",
    warning: "bg-warning/15 text-amber-600 dark:text-amber-400",
    danger: "bg-danger/15 text-red-600 dark:text-red-400",
  };

  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex items-start justify-between px-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {delta !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span className={cn("flex items-center gap-0.5 font-medium", good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(delta)}
                {deltaLabel ?? "%"}
              </span>
              <span className="text-muted-foreground">مقارنة بالفترة السابقة</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneStyles[tone])}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
