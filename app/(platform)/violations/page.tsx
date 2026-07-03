import { AlertTriangle, CheckCircle2, Siren, TrendingUp } from "lucide-react";

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
import { violations } from "@/lib/mock";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

const entityTypeColors: Record<string, string> = {
  contract: "bg-primary/10 text-primary",
  investment: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  transaction: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  policy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  fund: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const entityTypeAr: Record<string, string> = {
  contract: "عقد",
  investment: "استثمار",
  transaction: "معاملة",
  policy: "سياسة",
  fund: "صندوق",
};

export default function ViolationsPage() {
  const open = violations.filter((v) => v.status === "open" || v.status === "escalated" || v.status === "in-progress").length;
  const escalated = violations.filter((v) => v.status === "escalated").length;
  const resolved = violations.filter((v) => v.status === "resolved").length;
  const critical = violations.filter((v) => v.severity === "critical").length;
  const totalExposure = violations
    .filter((v) => v.status !== "resolved")
    .reduce((s, v) => s + v.financialExposure, 0);

  const sorted = [...violations].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { escalated: 0, open: 1, "in-progress": 2, resolved: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity])
      return (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5);
    return (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="المخالفات"
        description="مخالفات الامتثال النشطة والتاريخية المكتشفة بواسطة وكلاء الذكاء الاصطناعي. كل مخالفة قابلة للتتبع حتى اللائحة والكيان المعني."
        actions={
          <Button size="sm" variant="outline">
            تصدير تقرير المخالفات
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="مفتوحة / نشطة" value={String(open)} icon={Siren} tone="danger" invertDelta />
        <KpiCard label="مُصعَّدة" value={String(escalated)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="محلولة" value={String(resolved)} icon={CheckCircle2} tone="success" />
        <KpiCard label="حرجة" value={String(critical)} icon={TrendingUp} tone="danger" invertDelta />
        <KpiCard label="إجمالي التعرض" value={`$${(totalExposure / 1e6).toFixed(1)}M`} icon={TrendingUp} tone="warning" invertDelta />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">متتبع المخالفات</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المخالفة</TableHead>
                <TableHead>اللائحة</TableHead>
                <TableHead>الخطورة</TableHead>
                <TableHead>الكيان</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">التعرض</TableHead>
                <TableHead>المُكلَّف</TableHead>
                <TableHead>اكتُشفت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((v) => (
                <TableRow key={v.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="max-w-[220px]">
                      <p className="text-xs font-medium leading-snug">{v.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                    <span className="line-clamp-2 leading-snug">{v.regulation}</span>
                  </TableCell>
                  <TableCell><SeverityBadge value={v.severity} /></TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${entityTypeColors[v.entityType]}`}>
                        {entityTypeAr[v.entityType] ?? v.entityType}
                      </span>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[120px]">{v.entity}</p>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={v.status} /></TableCell>
                  <TableCell className="text-right text-xs">
                    {v.financialExposure > 0 ? (
                      <span className="font-semibold text-danger dark:text-red-400">
                        {formatCurrency(v.financialExposure, v.currency)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.assignedTo}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatRelativeTime(v.detectedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.filter((v) => v.status !== "resolved").map((v) => (
          <Card key={v.id} className={
            v.severity === "critical" ? "border-danger/30" :
            v.severity === "high" ? "border-orange-400/30" :
            "border-warning/30"
          }>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <SeverityBadge value={v.severity} />
                    <Badge variant="outline" className="text-[10px]">{entityTypeAr[v.entityType] ?? v.entityType}</Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold">{v.title}</CardTitle>
                </div>
                <StatusBadge status={v.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-muted bg-muted/30 p-2.5 text-xs">
                <p className="font-medium text-primary">{v.regulation}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
              <div className="flex items-center justify-between rounded-md border p-2.5 text-xs">
                <div>
                  <p className="text-muted-foreground">الكيان</p>
                  <p className="font-medium">{v.entity}</p>
                </div>
                {v.financialExposure > 0 && (
                  <div className="text-right">
                    <p className="text-muted-foreground">التعرض المالي</p>
                    <p className="font-semibold text-danger dark:text-red-400">{formatCurrency(v.financialExposure, v.currency)}</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-muted-foreground">المُكلَّف</p>
                  <p className="font-medium">{v.assignedTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
