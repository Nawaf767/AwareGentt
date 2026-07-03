import { CheckCircle2, Clock, ListChecks, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { tasks } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date("2026-07-02");
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString("ar-SA-u-nu-latn", { day: "numeric", month: "short" });

  if (diff < 0) return { label: `متأخر ${Math.abs(diff)} يوم`, className: "text-danger dark:text-red-400 font-semibold" };
  if (diff === 0) return { label: "يستحق اليوم", className: "text-danger dark:text-red-400 font-semibold" };
  if (diff <= 3) return { label: `${diff} أيام — ${formatted}`, className: "text-amber-600 dark:text-amber-400 font-semibold" };
  return { label: formatted, className: "text-muted-foreground" };
}

const statusGroups = [
  { status: "overdue", label: "متأخرة", color: "border-danger/30 bg-danger/5" },
  { status: "in-progress", label: "جارية", color: "border-primary/20 bg-primary/5" },
  { status: "open", label: "مفتوحة", color: "" },
  { status: "completed", label: "مكتملة", color: "opacity-60" },
] as const;

export default function TasksPage() {
  const open = tasks.filter((t) => t.status === "open").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="المهام"
        description="مهام الامتثال المُكلَّف بها أعضاء الفريق من قِبَل وكلاء الذكاء الاصطناعي ومسؤولي الامتثال. تتبع المعالجة وتحديثات السياسات والتقديمات التنظيمية."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            إنشاء مهمة
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="متأخرة" value={String(overdue)} icon={Clock} tone="danger" invertDelta />
        <KpiCard label="جارية" value={String(inProgress)} icon={ListChecks} tone="warning" />
        <KpiCard label="مفتوحة" value={String(open)} icon={ListChecks} tone="default" />
        <KpiCard label="مكتملة" value={String(completed)} icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {statusGroups.map(({ status, label, color }) => {
          const groupTasks = sortedTasks.filter((t) => t.status === status);
          if (groupTasks.length === 0) return null;
          return (
            <Card key={status} className={color}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {label}
                  <Badge variant="outline" className="text-[10px]">{groupTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupTasks.map((task) => {
                  const due = formatDueDate(task.dueDate);
                  return (
                    <div key={task.id} className="rounded-lg border bg-background p-3 space-y-2 cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <SeverityBadge value={task.priority} />
                        <Badge variant="outline" className="text-[10px]">{task.category}</Badge>
                      </div>
                      <p className="text-xs font-semibold leading-snug">{task.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          👤 {task.assignedTo}
                        </span>
                        <span className={due.className}>⏰ {due.label}</span>
                      </div>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">جميع المهام</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المهمة</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المُكلَّف</TableHead>
                <TableHead>أُسنِدت من</TableHead>
                <TableHead>تاريخ الاستحقاق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => {
                const due = formatDueDate(task.dueDate);
                return (
                  <TableRow key={task.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell>
                      <div className="max-w-[260px]">
                        <p className="text-xs font-medium leading-snug">{task.title}</p>
                      </div>
                    </TableCell>
                    <TableCell><SeverityBadge value={task.priority} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{task.category}</Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={task.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{task.assignedTo}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{task.assignedBy}</TableCell>
                    <TableCell className={`text-xs ${due.className}`}>{due.label}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
