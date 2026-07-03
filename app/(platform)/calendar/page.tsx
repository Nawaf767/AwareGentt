import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calendarEvents } from "@/lib/mock";

const typeColors: Record<string, string> = {
  deadline: "bg-danger/10 text-danger border-danger/25",
  submission: "bg-primary/10 text-primary border-primary/25",
  review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  audit: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  "board-meeting": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  training: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
};

const typeAr: Record<string, string> = {
  deadline: "موعد نهائي",
  submission: "تقديم",
  review: "مراجعة",
  audit: "تدقيق",
  "board-meeting": "اجتماع مجلس",
  training: "تدريب",
};

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-SA-u-nu-latn", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const now = new Date("2026-07-02");
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function CalendarPage() {
  const overdue = calendarEvents.filter((e) => e.status === "overdue").length;
  const upcoming7d = calendarEvents.filter((e) => {
    const d = daysUntil(e.date);
    return d >= 0 && d <= 7;
  }).length;
  const thisMonth = calendarEvents.filter((e) => e.date.startsWith("2026-07")).length;
  const completed = calendarEvents.filter((e) => e.status === "completed").length;

  const sorted = [...calendarEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming = sorted.filter((e) => e.status !== "completed" && e.status !== "overdue");
  const overdueEvents = sorted.filter((e) => e.status === "overdue");

  return (
    <div className="space-y-6">
      <PageHeader
        title="تقويم الامتثال"
        description="المواعيد النهائية التنظيمية والتقديمات والمراجعات واجتماعات مجلس الإدارة. لا تفوّت موعداً امتثالياً."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            إضافة حدث
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="متأخرة" value={String(overdue)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="هذا الأسبوع" value={String(upcoming7d)} icon={Clock} tone="warning" />
        <KpiCard label="هذا الشهر" value={String(thisMonth)} icon={CalendarDays} tone="default" />
        <KpiCard label="مكتملة" value={String(completed)} icon={CheckCircle2} tone="success" />
      </div>

      {overdueEvents.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-danger dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            متأخرة ({overdueEvents.length})
          </h2>
          <div className="space-y-2">
            {overdueEvents.map((event) => (
              <Card key={event.id} className="border-danger/30 bg-danger/5">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${typeColors[event.type]}`}>
                        {typeAr[event.type] ?? event.type}
                      </span>
                      <SeverityBadge value={event.priority} />
                    </div>
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {event.regulator && <span>📌 {event.regulator}</span>}
                      <span>👤 {event.assignedTo}</span>
                      <span className="text-danger dark:text-red-400 font-medium">
                        كان مقرراً في {formatEventDate(event.date)}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    إجراء مطلوب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">الأحداث القادمة</h2>
        <div className="space-y-2">
          {upcoming.map((event) => {
            const days = daysUntil(event.date);
            const isUrgent = days <= 7;
            const isSoon = days <= 30;
            return (
              <Card key={event.id} className={
                isUrgent ? "border-warning/40" :
                isSoon ? "border-primary/20" : ""
              }>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-lg border py-2 text-center ${
                    isUrgent ? "border-warning/40 bg-warning/5" :
                    isSoon ? "border-primary/25 bg-primary/5" :
                    "border-border bg-muted/30"
                  }`}>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      {new Date(event.date).toLocaleDateString("ar-SA-u-nu-latn", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold leading-tight">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(event.date).getFullYear()}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${typeColors[event.type]}`}>
                        {typeAr[event.type] ?? event.type}
                      </span>
                      <SeverityBadge value={event.priority} />
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {event.regulator && (
                        <span className="flex items-center gap-1">
                          <span>📌</span> {event.regulator}
                        </span>
                      )}
                      <span>👤 {event.assignedTo}</span>
                      {event.time && <span>🕐 {event.time}</span>}
                    </div>
                  </div>

                  <div className={`shrink-0 text-right text-xs font-semibold ${
                    days <= 7 ? "text-danger dark:text-red-400" :
                    days <= 30 ? "text-amber-600 dark:text-amber-400" :
                    "text-muted-foreground"
                  }`}>
                    {days === 0 ? "اليوم" : days === 1 ? "غداً" : `${days} يوماً`}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
