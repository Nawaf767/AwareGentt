import { CheckCircle2, LineChart, Plus, XCircle } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { investments } from "@/lib/mock";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

const decisionStyles: Record<string, string> = {
  approved: "text-emerald-600 dark:text-emerald-400 bg-success/10 border-success/30",
  rejected: "text-red-600 dark:text-red-400 bg-danger/10 border-danger/30",
  "needs-changes": "text-amber-600 dark:text-amber-400 bg-warning/10 border-warning/30",
  pending: "text-primary bg-primary/10 border-primary/25",
};

const decisionAr: Record<string, string> = {
  approved: "موافق عليه",
  rejected: "مرفوض",
  "needs-changes": "يحتاج تعديلات",
  pending: "معلق",
};

const checkStyles: Record<string, string> = {
  pass: "text-emerald-600 dark:text-emerald-400",
  fail: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
};

const checkIcon: Record<string, string> = {
  pass: "✓",
  fail: "✗",
  warning: "⚠",
};

export default function InvestmentsPage() {
  const approved = investments.filter((i) => i.decision === "approved").length;
  const rejected = investments.filter((i) => i.decision === "rejected").length;
  const pending = investments.filter((i) => i.decision === "pending").length;
  const avgConfidence = Math.round(investments.reduce((s, i) => s + i.confidence, 0) / investments.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الاستثمارات"
        description="فحص الامتثال المسبق للاستثمار بالذكاء الاصطناعي. يتم التحقق من كل قرار استثماري مقابل السياسة وتفويضات الصندوق والحدود التنظيمية قبل التنفيذ."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            طلب جديد
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="موافق عليها" value={String(approved)} icon={CheckCircle2} tone="success" />
        <KpiCard label="مرفوضة" value={String(rejected)} icon={XCircle} tone="danger" invertDelta />
        <KpiCard label="قيد المراجعة" value={String(pending)} icon={LineChart} tone="warning" />
        <KpiCard label="متوسط ثقة الذكاء الاصطناعي" value={`${avgConfidence}%`} icon={CheckCircle2} tone="default" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">قرارات الاستثمار</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاستثمار</TableHead>
                <TableHead>الصندوق</TableHead>
                <TableHead>فئة الأصل</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead>القرار</TableHead>
                <TableHead className="text-right">درجة المخاطر</TableHead>
                <TableHead className="text-right">ثقة الذكاء الاصطناعي</TableHead>
                <TableHead>تاريخ الطلب</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium">{inv.name}</p>
                      <p className="text-[11px] text-muted-foreground">بواسطة {inv.requestedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.fund}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{inv.assetClass}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold">
                    {formatCurrency(inv.amount, inv.currency)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${decisionStyles[inv.decision]}`}>
                      {decisionAr[inv.decision] ?? inv.decision}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    <span className={
                      inv.riskScore >= 70 ? "text-red-600 dark:text-red-400 font-semibold" :
                      inv.riskScore >= 40 ? "text-amber-600 dark:text-amber-400 font-semibold" :
                      "text-emerald-600 dark:text-emerald-400 font-semibold"
                    }>
                      {inv.riskScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium">{inv.confidence}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatRelativeTime(inv.requestedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {investments.map((inv) => (
          <Card key={inv.id} className={
            inv.decision === "rejected" ? "border-danger/30" :
            inv.decision === "approved" ? "border-success/30" :
            "border-warning/30"
          }>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">{inv.name}</CardTitle>
                  <CardDescription className="text-xs">{inv.fund} · {inv.assetClass}</CardDescription>
                </div>
                <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${decisionStyles[inv.decision]}`}>
                  {decisionAr[inv.decision] ?? inv.decision}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
                <div>
                  <p className="text-muted-foreground">المبلغ</p>
                  <p className="font-semibold">{formatCurrency(inv.amount, inv.currency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">درجة المخاطر</p>
                  <p className="font-semibold">{inv.riskScore}/100</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ثقة الذكاء الاصطناعي</p>
                  <p className="font-semibold">{inv.confidence}%</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">فحوصات الامتثال</p>
                <div className="space-y-1">
                  {inv.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`font-bold shrink-0 ${checkStyles[check.status]}`}>{checkIcon[check.status]}</span>
                      <div>
                        <span className="font-medium">{check.label}: </span>
                        <span className="text-muted-foreground">{check.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{inv.explanation}</p>

              {inv.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">التوصيات</p>
                  {inv.recommendations.map((rec, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {rec}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
