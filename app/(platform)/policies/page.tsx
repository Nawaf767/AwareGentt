import { AlertTriangle, BookOpenCheck, CheckCircle2, Clock, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { policies } from "@/lib/mock";
import { formatDate, formatRelativeTime } from "@/lib/format";

export default function PoliciesPage() {
  const active = policies.filter((p) => p.status === "active").length;
  const draft = policies.filter((p) => p.status === "draft").length;
  const outdated = policies.filter((p) => p.status === "outdated").length;
  const totalRules = policies.reduce((s, p) => s + p.rulesGenerated, 0);
  const withInconsistencies = policies.filter((p) => p.inconsistencies.length > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="السياسات"
        description="سياسات الامتثال الداخلية مُحوَّلة إلى قواعد ذكاء اصطناعي قابلة للتنفيذ. يراقب وكيل استخبارات السياسات باستمرار التناقضات والأحكام المنتهية الصلاحية."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Clock className="h-3.5 w-3.5" />
              قائمة المراجعة
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              سياسة جديدة
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="نشطة" value={String(active)} icon={CheckCircle2} tone="success" />
        <KpiCard label="مسودة" value={String(draft)} icon={Clock} tone="warning" />
        <KpiCard label="منتهية الصلاحية" value={String(outdated)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="القواعد المُنشأة" value={String(totalRules)} icon={BookOpenCheck} tone="default" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">سجل السياسات</CardTitle>
            {withInconsistencies > 0 && (
              <Badge variant="outline" className="text-[10px] border-warning/30 text-amber-600 dark:text-amber-400">
                {withInconsistencies} بها تناقضات
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>السياسة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>المسؤول</TableHead>
                <TableHead>الإصدار</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">القواعد</TableHead>
                <TableHead>آخر مراجعة</TableHead>
                <TableHead>المشاكل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs font-medium">{policy.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{policy.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{policy.owner}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">v{policy.version}</TableCell>
                  <TableCell><StatusBadge status={policy.status} /></TableCell>
                  <TableCell className="text-right text-xs font-semibold text-primary">{policy.rulesGenerated}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatRelativeTime(policy.lastReviewed)}</TableCell>
                  <TableCell>
                    {policy.inconsistencies.length > 0 ? (
                      <Badge variant="outline" className="text-[10px] border-warning/30 text-amber-600 dark:text-amber-400">
                        {policy.inconsistencies.length} مشكلة
                      </Badge>
                    ) : (
                      <span className="text-xs text-success font-medium">سليمة</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {policies.filter((p) => p.inconsistencies.length > 0 || p.recommendation).map((policy) => (
          <Card key={policy.id} className={policy.status === "outdated" ? "border-warning/30" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{policy.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{policy.category} · v{policy.version} · {policy.owner}</p>
                </div>
                <StatusBadge status={policy.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {policy.inconsistencies.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">تناقضات مكتشفة</p>
                  {policy.inconsistencies.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 p-2.5 text-xs">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                      <p className="text-muted-foreground">{issue}</p>
                    </div>
                  ))}
                </div>
              )}
              {policy.recommendation && (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs">
                  <p className="font-medium text-primary mb-0.5">توصية الذكاء الاصطناعي</p>
                  <p className="text-muted-foreground">{policy.recommendation}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{policy.rulesGenerated} قاعدة قابلة للتنفيذ</span>
                <span>آخر مراجعة {formatRelativeTime(policy.lastReviewed)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
