import { Bot, ClipboardCheck, Download, ShieldCheck, User, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { auditEntries } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const actorTypeIcons: Record<string, React.ElementType> = {
  agent: Bot,
  user: User,
  system: Zap,
};

const actorTypeColors: Record<string, string> = {
  agent: "bg-primary/10 text-primary border-primary/25",
  user: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  system: "bg-muted text-muted-foreground border-border",
};

const actorTypeAr: Record<string, string> = {
  agent: "وكيل",
  user: "مستخدم",
  system: "نظام",
};

export default function AuditPage() {
  const total = auditEntries.length;
  const byAgents = auditEntries.filter((e) => e.actorType === "agent").length;
  const byUsers = auditEntries.filter((e) => e.actorType === "user").length;
  const failures = auditEntries.filter((e) => e.outcome === "failure").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="سجل التدقيق"
        description="مسار تدقيق غير قابل للتغيير لجميع إجراءات الامتثال التي يتخذها وكلاء الذكاء الاصطناعي والمستخدمون وعمليات النظام. كل حدث مُختوم بطابع زمني ومرتبط بالأدلة."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-3.5 w-3.5" />
              تصدير السجل
            </Button>
            <Button size="sm" variant="outline">
              البحث في الأحداث
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="إجمالي المدخلات" value={String(total)} icon={ClipboardCheck} tone="default" />
        <KpiCard label="إجراءات الوكلاء" value={String(byAgents)} icon={Bot} tone="default" />
        <KpiCard label="إجراءات المستخدمين" value={String(byUsers)} icon={User} tone="default" />
        <KpiCard label="فشل" value={String(failures)} icon={ShieldCheck} tone={failures > 0 ? "danger" : "success"} invertDelta />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">مسار التدقيق</CardTitle>
            <Badge variant="outline" className="text-[10px]">غير قابل للتغيير · مختوم تشفيرياً</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>المُنفِّذ</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الإجراء</TableHead>
                <TableHead>الكيان</TableHead>
                <TableHead>نوع الكيان</TableHead>
                <TableHead>النتيجة</TableHead>
                <TableHead>مرجع الدليل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEntries.map((entry) => {
                const ActorIcon = actorTypeIcons[entry.actorType] ?? User;
                return (
                  <TableRow key={entry.id} className={`cursor-pointer hover:bg-muted/40 ${entry.outcome === "failure" ? "bg-danger/5" : ""}`}>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString("ar-SA-u-nu-latn", {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <ActorIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium max-w-[140px] truncate">{entry.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${actorTypeColors[entry.actorType]}`}>
                        {actorTypeAr[entry.actorType] ?? entry.actorType}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px]">
                      <span className={entry.outcome === "failure" ? "text-danger dark:text-red-400 font-medium" : ""}>
                        {entry.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{entry.entity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{entry.entityType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        entry.outcome === "success"
                          ? "bg-success/10 text-emerald-600 dark:text-emerald-400 border border-success/25"
                          : "bg-danger/10 text-danger border border-danger/25"
                      }`}>
                        {entry.outcome === "success" ? "نجاح" : "فشل"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] text-muted-foreground font-mono">{entry.evidenceRef}</code>
                    </TableCell>
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
