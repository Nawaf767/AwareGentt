import { AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";

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
import { risks } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const levelAr: Record<string, string> = {
  critical: "حرجة",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};

function ImpactBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-danger" : value >= 60 ? "bg-warning" : value >= 40 ? "bg-amber-400" : "bg-primary";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs">{value}%</span>
    </div>
  );
}

export default function RisksPage() {
  const critical = risks.filter((r) => r.level === "critical").length;
  const high = risks.filter((r) => r.level === "high").length;
  const open = risks.filter((r) => r.status === "open").length;
  const monitoring = risks.filter((r) => r.status === "monitoring").length;

  const sortedRisks = [...risks].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, minimal: 4 };
    return (order[a.level] ?? 5) - (order[b.level] ?? 5);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="استخبارات المخاطر"
        description="مخاطر الامتثال المتنبأ بها بالذكاء الاصطناعي مرتبة حسب الاحتمالية والتأثير. يتوقع وكيل التنبؤ بالمخاطر المخالفات قبل حدوثها."
        actions={
          <Button size="sm" variant="outline">
            تصدير سجل المخاطر
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="مخاطر حرجة" value={String(critical)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="مخاطر عالية" value={String(high)} icon={ShieldAlert} tone="warning" invertDelta />
        <KpiCard label="مفتوحة" value={String(open)} icon={TrendingUp} tone="danger" invertDelta />
        <KpiCard label="قيد المراقبة" value={String(monitoring)} icon={ShieldAlert} tone="warning" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((level) => {
          const levelRisks = risks.filter((r) => r.level === level);
          const colors: Record<string, string> = {
            critical: "border-danger/30 bg-danger/5",
            high: "border-orange-400/30 bg-orange-400/5",
            medium: "border-warning/30 bg-warning/5",
            low: "border-border bg-muted/30",
          };
          const textColors: Record<string, string> = {
            critical: "text-red-600 dark:text-red-400",
            high: "text-orange-600 dark:text-orange-400",
            medium: "text-amber-600 dark:text-amber-400",
            low: "text-muted-foreground",
          };
          return (
            <div key={level} className={`rounded-lg border p-3 ${colors[level]}`}>
              <p className={`text-2xl font-semibold ${textColors[level]}`}>{levelRisks.length}</p>
              <p className={`text-xs font-medium ${textColors[level]}`}>مخاطر {levelAr[level]}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {levelRisks.filter((r) => r.status === "open").length} مفتوحة
              </p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">سجل المخاطر</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الخطر</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>الاحتمالية</TableHead>
                <TableHead>التأثير التجاري</TableHead>
                <TableHead>التأثير الامتثالي</TableHead>
                <TableHead>الكيان</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRisks.map((risk) => (
                <TableRow key={risk.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="max-w-[240px]">
                      <p className="text-xs font-medium leading-snug">{risk.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelativeTime(risk.detectedAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{risk.category}</Badge>
                  </TableCell>
                  <TableCell><SeverityBadge value={risk.level} /></TableCell>
                  <TableCell><ImpactBar value={risk.probability} /></TableCell>
                  <TableCell><ImpactBar value={risk.businessImpact} /></TableCell>
                  <TableCell><ImpactBar value={risk.complianceImpact} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{risk.relatedEntity}</TableCell>
                  <TableCell><StatusBadge status={risk.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sortedRisks.filter((r) => r.level === "critical" || r.level === "high").map((risk) => (
          <Card key={risk.id} className={risk.level === "critical" ? "border-danger/30" : "border-warning/30"}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge value={risk.level} />
                    <Badge variant="outline" className="text-[10px]">{risk.category}</Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold">{risk.title}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{risk.relatedEntity}</CardDescription>
                </div>
                <StatusBadge status={risk.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
                <div>
                  <p className="text-muted-foreground">الاحتمالية</p>
                  <p className="font-semibold text-sm">{risk.probability}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">التأثير التجاري</p>
                  <p className="font-semibold text-sm">{risk.businessImpact}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">التأثير الامتثالي</p>
                  <p className="font-semibold text-sm">{risk.complianceImpact}%</p>
                </div>
              </div>
              <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs">
                <p className="font-medium text-primary mb-0.5">توصية الذكاء الاصطناعي</p>
                <p className="text-muted-foreground">{risk.recommendation}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">تم اكتشافه {formatRelativeTime(risk.detectedAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
