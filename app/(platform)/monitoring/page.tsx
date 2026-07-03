import { Activity, AlertTriangle, CheckCircle2, Shield } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { monitoringEvents } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const typeColors: Record<string, string> = {
  transaction: "bg-primary/10 text-primary",
  approval: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  workflow: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "fund-movement": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  login: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  system: "bg-muted text-muted-foreground",
};

const typeAr: Record<string, string> = {
  transaction: "معاملة",
  approval: "موافقة",
  workflow: "سير عمل",
  "fund-movement": "حركة صندوق",
  login: "تسجيل دخول",
  system: "نظام",
};

function RiskScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-danger dark:text-red-400 bg-danger/10 border-danger/25" :
    score >= 60 ? "text-amber-600 dark:text-amber-400 bg-warning/10 border-warning/25" :
    score >= 30 ? "text-amber-500/80 bg-amber-500/5 border-amber-500/20" :
    "text-muted-foreground bg-muted border-border";
  return (
    <span className={`inline-flex rounded border px-1.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export default function MonitoringPage() {
  const flagged = monitoringEvents.filter((e) => e.status === "flagged").length;
  const blocked = monitoringEvents.filter((e) => e.status === "blocked").length;
  const normal = monitoringEvents.filter((e) => e.status === "normal").length;
  const avgRisk = Math.round(monitoringEvents.reduce((s, e) => s + e.riskScore, 0) / monitoringEvents.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="المراقبة في الوقت الفعلي"
        description="تدفق الأحداث المباشر من وكيل المراقبة في الوقت الفعلي. المعاملات والموافقات وعمليات تسجيل الدخول وحركات الصناديق تُفحص باستمرار."
        actions={
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs text-muted-foreground">مباشر</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="أحداث مُعلَّمة" value={String(flagged)} icon={AlertTriangle} tone="warning" invertDelta />
        <KpiCard label="محظورة" value={String(blocked)} icon={Shield} tone="danger" invertDelta />
        <KpiCard label="طبيعية" value={String(normal)} icon={CheckCircle2} tone="success" />
        <KpiCard label="متوسط درجة المخاطر" value={String(avgRisk)} icon={Activity} tone={avgRisk >= 50 ? "warning" : "default"} />
      </div>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {(["transaction", "approval", "workflow", "fund-movement", "login", "system"] as const).map((type) => {
          const count = monitoringEvents.filter((e) => e.type === type).length;
          return (
            <Card key={type} className="py-3">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">{typeAr[type]}</p>
                <p className="text-xl font-semibold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">تدفق الأحداث</CardTitle>
            <Badge variant="outline" className="text-[10px]">{monitoringEvents.length} حدث (آخر ساعتين)</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الكيان</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">درجة المخاطر</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoringEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className={`cursor-pointer hover:bg-muted/40 ${event.status === "blocked" ? "bg-danger/5" : event.status === "flagged" ? "bg-warning/5" : ""}`}
                >
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(event.timestamp).toLocaleTimeString("ar-SA-u-nu-latn", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${typeColors[event.type]}`}>
                      {typeAr[event.type] ?? event.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs max-w-[300px]">
                    <span className={event.status === "blocked" ? "text-danger dark:text-red-400 font-medium" : event.status === "flagged" ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}>
                      {event.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{event.entity}</TableCell>
                  <TableCell><StatusBadge status={event.status} /></TableCell>
                  <TableCell className="text-right"><RiskScoreBadge score={event.riskScore} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
