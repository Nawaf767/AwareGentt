import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { timeline } from "@/lib/mock";

const dotTone: Record<string, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-primary",
};

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">الجدول الزمني المباشر</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-5 pl-4">
          <div className="absolute top-1 bottom-1 left-[3px] w-px bg-border" />
          {timeline.map((t) => (
            <div key={t.id} className="relative">
              <span className={cn("absolute -left-4 top-1 h-2 w-2 rounded-full", dotTone[t.kind])} />
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{t.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
