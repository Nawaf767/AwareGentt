import { BookOpen, CheckCircle2, Clock, FileText, RefreshCw, Upload } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { regulations } from "@/lib/mock";
import { formatDate } from "@/lib/format";

const oblTypeAr: Record<string, string> = {
  obligation: "التزامات",
  restriction: "قيود",
  reporting: "تقارير",
  disclosure: "إفصاحات",
};

export default function RegulationsPage() {
  const processed = regulations.filter((r) => r.status === "processed").length;
  const needsReview = regulations.filter((r) => r.status === "needs-review").length;
  const processing = regulations.filter((r) => r.status === "processing").length;
  const totalRules = regulations.reduce((s, r) => s + r.linkedRulesGenerated, 0);
  const totalObligations = regulations.reduce((s, r) => s + r.obligations.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأنظمة واللوائح"
        description="مكتبة تنظيمية مفهرسة بالذكاء الاصطناعي. يتم تحليل كل لائحة واستخراج الالتزامات وتحويلها إلى قواعد امتثال قابلة للتنفيذ."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3.5 w-3.5" />
              مزامنة المصادر
            </Button>
            <Button size="sm">
              <Upload className="h-3.5 w-3.5" />
              رفع لائحة
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="تمت المعالجة" value={String(processed)} delta={2} icon={CheckCircle2} tone="success" />
        <KpiCard label="تحتاج مراجعة" value={String(needsReview)} icon={Clock} tone="warning" invertDelta />
        <KpiCard label="قيد المعالجة" value={String(processing)} icon={RefreshCw} tone="default" />
        <KpiCard label="القواعد المُنشأة" value={String(totalRules)} delta={21} icon={BookOpen} tone="default" />
      </div>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {["obligation", "restriction", "reporting", "disclosure"].map((type) => {
          const count = regulations.flatMap((r) => r.obligations).filter((o) => o.type === type).length;
          return (
            <Card key={type} className="py-3">
              <CardContent className="px-4">
                <p className="text-xs text-muted-foreground">{oblTypeAr[type] ?? type}</p>
                <p className="text-xl font-semibold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
        <Card className="py-3">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">إجمالي الالتزامات</p>
            <p className="text-xl font-semibold">{totalObligations}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">إجمالي المواد</p>
            <p className="text-xl font-semibold">{regulations.reduce((s, r) => s + r.articles, 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">المكتبة التنظيمية</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اللائحة</TableHead>
                <TableHead>الجهة التنظيمية</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">المواد</TableHead>
                <TableHead className="text-right">الالتزامات</TableHead>
                <TableHead className="text-right">القواعد</TableHead>
                <TableHead>تاريخ النفاذ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regulations.map((reg) => (
                <TableRow key={reg.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium leading-snug max-w-[280px]">{reg.title}</p>
                        <p className="text-[11px] text-muted-foreground">{reg.jurisdiction} · v{reg.version}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{reg.regulator}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{reg.category}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={reg.status} /></TableCell>
                  <TableCell className="text-right text-xs font-medium">{reg.articles}</TableCell>
                  <TableCell className="text-right text-xs font-medium">{reg.obligations.length}</TableCell>
                  <TableCell className="text-right text-xs font-medium">
                    {reg.linkedRulesGenerated > 0 ? (
                      <span className="text-primary font-semibold">{reg.linkedRulesGenerated}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(reg.effectiveDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {regulations.filter((r) => r.obligations.length > 0).map((reg) => (
          <Card key={reg.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {reg.title.substring(0, 50)}...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reg.obligations.map((obl) => (
                <div key={obl.id} className="flex items-start gap-2 rounded-md border p-2.5 text-xs">
                  <Badge variant="outline" className="shrink-0 text-[10px]">{oblTypeAr[obl.type] ?? obl.type}</Badge>
                  <div className="min-w-0">
                    <span className="font-medium text-primary mr-1">{obl.article}</span>
                    <span className="text-muted-foreground">{obl.text}</span>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {obl.appliesTo.map((t) => (
                        <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {reg.deadlines.map((dl) => (
                <div key={dl.label} className="flex items-center justify-between rounded-md bg-warning/5 border border-warning/20 px-2.5 py-2 text-xs">
                  <span className="text-amber-700 dark:text-amber-400 font-medium">⏰ {dl.label}</span>
                  <span className="text-muted-foreground">{formatDate(dl.date)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
