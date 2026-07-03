import { AlertTriangle, Landmark, ShieldCheck, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { funds } from "@/lib/mock";
import { formatCurrency, formatDate } from "@/lib/format";

function ComplianceScore({ score }: { score: number }) {
  const textColor =
    score >= 90 ? "text-emerald-600 dark:text-emerald-400" :
    score >= 70 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";
  const barColor =
    score >= 90 ? "bg-success" :
    score >= 70 ? "bg-warning" :
    "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{score}%</span>
    </div>
  );
}

function ExposureBar({ current, limit }: { current: number; limit: number }) {
  const pct = (current / limit) * 100;
  const color = pct >= 100 ? "bg-danger" : pct >= 90 ? "bg-warning" : "bg-primary";
  return (
    <div className="space-y-0.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{current}%</span>
        <span>الحد: {limit}%</span>
      </div>
    </div>
  );
}

export default function FundsPage() {
  const totalAum = funds.reduce((s, f) => s + f.aum, 0);
  const avgCompliance = Math.round(funds.reduce((s, f) => s + f.complianceScore, 0) / funds.length);
  const breaches = funds.filter((f) => f.status === "breach").length;
  const warnings = funds.filter((f) => f.status === "warning").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الصناديق"
        description="مراقبة الامتثال في الوقت الفعلي لجميع الصناديق المُدارة. حدود التعرض والتزام التفويض ودرجات الامتثال تُتابع باستمرار."
        actions={
          <Button size="sm" variant="outline">
            تصدير تقرير الصناديق
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="إجمالي الأصول المُدارة" value={`$${(totalAum / 1e9).toFixed(2)}B`} icon={Landmark} tone="default" />
        <KpiCard label="متوسط الامتثال" value={`${avgCompliance}%`} icon={ShieldCheck} tone={avgCompliance >= 85 ? "success" : "warning"} />
        <KpiCard label="اختراقات التعرض" value={String(breaches)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="التحذيرات" value={String(warnings)} icon={TrendingUp} tone="warning" invertDelta />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {funds.map((fund) => (
          <Card key={fund.id} className={
            fund.status === "breach" ? "border-danger/30" :
            fund.status === "warning" ? "border-warning/30" : ""
          }>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">{fund.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {fund.strategy} · المدير: {fund.manager}
                  </CardDescription>
                </div>
                <StatusBadge status={fund.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-1">الأصول الخاضعة للإدارة</p>
                <p className="text-2xl font-semibold tracking-tight">{formatCurrency(fund.aum, fund.currency)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">تاريخ التأسيس: {formatDate(fund.inceptionDate)}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">درجة الامتثال</span>
                </div>
                <ComplianceScore score={fund.complianceScore} />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">تعرض التفويض</p>
                <ExposureBar current={fund.currentExposure} limit={fund.exposureLimit} />
                {fund.currentExposure > fund.exposureLimit && (
                  <p className="text-xs text-danger dark:text-red-400 font-medium">
                    ⚠ اختراق: {(fund.currentExposure - fund.exposureLimit).toFixed(1)}% فوق الحد
                  </p>
                )}
                {fund.currentExposure / fund.exposureLimit >= 0.95 && fund.currentExposure <= fund.exposureLimit && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    ⚠ قريب من الحد: {((fund.currentExposure / fund.exposureLimit) * 100).toFixed(0)}% مُستخدم
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">جدول ملخص الصناديق</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصندوق</TableHead>
                <TableHead>المدير</TableHead>
                <TableHead>الاستراتيجية</TableHead>
                <TableHead className="text-right">الأصول المُدارة</TableHead>
                <TableHead>التعرض</TableHead>
                <TableHead>الامتثال</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((fund) => (
                <TableRow key={fund.id} className="hover:bg-muted/40 cursor-pointer">
                  <TableCell className="text-xs font-medium">{fund.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fund.manager}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{fund.strategy.split(" ")[0]}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold">{formatCurrency(fund.aum, fund.currency)}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${fund.currentExposure > fund.exposureLimit ? "text-danger dark:text-red-400" : "text-muted-foreground"}`}>
                      {fund.currentExposure}% / {fund.exposureLimit}%
                    </span>
                  </TableCell>
                  <TableCell><ComplianceScore score={fund.complianceScore} /></TableCell>
                  <TableCell><StatusBadge status={fund.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
