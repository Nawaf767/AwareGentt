import { AlertTriangle, ArrowDownLeft, ArrowUpRight, CheckCircle2, Inbox, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { regulatoryRequests } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

function daysUntilDue(dateStr: string) {
  const now = new Date("2026-07-02");
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RegulatoryRequestsPage() {
  const open = regulatoryRequests.filter((r) =>
    ["draft", "acknowledged"].includes(r.status)
  ).length;
  const overdue = regulatoryRequests.filter((r) => r.status === "overdue").length;
  const submitted = regulatoryRequests.filter((r) =>
    ["submitted", "responded"].includes(r.status)
  ).length;
  const incoming = regulatoryRequests.filter((r) => r.direction === "incoming").length;
  const outgoing = regulatoryRequests.filter((r) => r.direction === "outgoing").length;

  const sorted = [...regulatoryRequests].sort((a, b) => {
    if (a.status === "overdue") return -1;
    if (b.status === "overdue") return 1;
    const da = daysUntilDue(a.dueDate);
    const db = daysUntilDue(b.dueDate);
    return da - db;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="الطلبات التنظيمية"
        description="تتبع جميع طلبات المعلومات والاستفسارات والمراجعات الإشرافية والتقديمات من وإلى الجهات التنظيمية بما فيها هيئة السوق المالية ومؤسسة النقد وFCA وSEC وESMA."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            طلب جديد
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="مفتوحة / معلقة" value={String(open)} icon={Inbox} tone="warning" />
        <KpiCard label="متأخرة" value={String(overdue)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="مُقدَّمة" value={String(submitted)} icon={CheckCircle2} tone="success" />
        <KpiCard label="واردة" value={String(incoming)} icon={ArrowDownLeft} tone="default" />
        <KpiCard label="صادرة" value={String(outgoing)} icon={ArrowUpRight} tone="default" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">متتبع الطلبات</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المرجع</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>الجهة التنظيمية</TableHead>
                <TableHead>الاتجاه</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الاستحقاق</TableHead>
                <TableHead>المُكلَّف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((req) => {
                const days = daysUntilDue(req.dueDate);
                const dueColor = req.status === "overdue" ? "text-danger dark:text-red-400 font-semibold" :
                  days <= 7 ? "text-amber-600 dark:text-amber-400 font-semibold" :
                  "text-muted-foreground";
                return (
                  <TableRow key={req.id} className={`cursor-pointer hover:bg-muted/40 ${req.status === "overdue" ? "bg-danger/5" : ""}`}>
                    <TableCell>
                      <code className="text-[10px] font-mono text-primary">{req.reference}</code>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium max-w-[200px] leading-snug">{req.title}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{req.regulator}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                        req.direction === "incoming"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25"
                      }`}>
                        {req.direction === "incoming" ? <ArrowDownLeft className="h-2.5 w-2.5" /> : <ArrowUpRight className="h-2.5 w-2.5" />}
                        {req.direction === "incoming" ? "واردة" : "صادرة"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{req.type}</Badge>
                    </TableCell>
                    <TableCell><SeverityBadge value={req.priority} /></TableCell>
                    <TableCell><StatusBadge status={req.status} /></TableCell>
                    <TableCell className={`text-xs ${dueColor}`}>
                      {req.status === "overdue"
                        ? `متأخر ${Math.abs(days)} يوم`
                        : new Date(req.dueDate).toLocaleDateString("ar-SA-u-nu-latn", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{req.assignedTo}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.filter((r) => r.status === "overdue" || (r.status === "acknowledged" && daysUntilDue(r.dueDate) <= 14)).map((req) => {
          const days = daysUntilDue(req.dueDate);
          return (
            <Card key={req.id} className={req.status === "overdue" ? "border-danger/40" : "border-warning/30"}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <code className="text-[10px] font-mono text-primary">{req.reference}</code>
                    <CardTitle className="text-sm font-semibold">{req.title}</CardTitle>
                    <CardDescription className="text-xs">{req.regulator} · {req.type}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={req.status} />
                    <SeverityBadge value={req.priority} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>
                <div className="flex items-center justify-between rounded-md border p-2.5 text-xs">
                  <div>
                    <p className="text-muted-foreground">المُكلَّف</p>
                    <p className="font-medium">{req.assignedTo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">تاريخ الاستحقاق</p>
                    <p className={`font-semibold ${req.status === "overdue" ? "text-danger dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {req.status === "overdue" ? `متأخر ${Math.abs(days)} يوم` : `متبقٍّ ${days} يوم`}
                    </p>
                  </div>
                </div>
                {req.documents.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">المستندات</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.documents.map((doc) => (
                        <Badge key={doc} variant="outline" className="text-[10px]">{doc}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button size="sm" variant="outline" className="w-full">
                  {req.status === "overdue" ? "اتخاذ إجراء فوري" : req.status === "draft" ? "متابعة المسودة" : "إدارة الرد"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
