import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileBarChart,
  Landmark,
  Shield,
  ShieldCheck,
  Siren,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  violations, risks, funds, regulatoryRequests, calendarEvents, agents, kpiSummary,
} from "@/lib/mock";
import { formatCurrency } from "@/lib/format";

function ScoreCard({
  label,
  value,
  max = 100,
  color,
}: {
  label: string;
  value: number;
  max?: number;
  color: "success" | "warning" | "danger";
}) {
  const pct = (value / max) * 100;
  const barColor = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[color];
  const textColor = {
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  }[color];
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ExecutivePage() {
  const criticalRisks = risks.filter((r) => r.level === "critical");
  const openViolations = violations.filter((v) => v.status !== "resolved");
  const totalExposure = openViolations.reduce((s, v) => s + v.financialExposure, 0);
  const overdueRequests = regulatoryRequests.filter((r) => r.status === "overdue");
  const urgentEvents = calendarEvents.filter((e) => {
    if (e.status === "overdue") return true;
    const days = Math.ceil((new Date(e.date).getTime() - new Date("2026-07-02").getTime()) / 86400000);
    return days >= 0 && days <= 14;
  });
  const avgFundCompliance = Math.round(funds.reduce((s, f) => s + f.complianceScore, 0) / funds.length);

  const execRecommendations = [
    {
      priority: "critical" as const,
      action: "إجازة مراجعة مجلس الإدارة للإقراض بين الصناديق",
      rationale: "معاملة الصندوق التابع محظورة في انتظار الموافقة المستقلة من مجلس الإدارة — خطر انتهاك تنظيمي حرج.",
      owner: "مجلس الإدارة / الرئيس التنفيذي",
    },
    {
      priority: "critical" as const,
      action: "الموافقة على زيادة احتياطي السيولة عالية الجودة لصندوق أطلس للدخل الثابت",
      rationale: "وكيل التنبؤ بالمخاطر يقدر احتمالية اختراق نسبة تغطية السيولة بـ68% خلال 30 يوماً. مطلوب زيادة 120 مليون دولار في الأصول السائلة.",
      owner: "المدير المالي / مدير المخاطر",
    },
    {
      priority: "high" as const,
      action: "إعطاء الأولوية للرد على المراجعة الموضوعية لمكافحة غسل الأموال من هيئة السلوك المالي",
      rationale: "الرد على FCA-2026-AML-0501 متأخر يومين. قد يُفضي عدم الرد إلى إجراءات رقابية.",
      owner: "مسؤول الامتثال الرئيسي",
    },
    {
      priority: "high" as const,
      action: "الموافقة على خارطة طريق امتثال MiCA العنوان الرابع",
      rationale: "الموعد النهائي للانتقال في 30 ديسمبر. تحليل الفجوات يكشف فجوتين حرجتين تستلزمان 3-4 أشهر للمعالجة.",
      owner: "المدير التقني / مسؤول الامتثال الرئيسي",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الذكاء التنفيذي"
        description="ملخص الوضع الامتثالي على مستوى مجلس الإدارة. رؤى مقطرة من الذكاء الاصطناعي من جميع الوكلاء لدعم قرارات الإدارة التنفيذية ومجلس الإدارة."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <FileBarChart className="h-3.5 w-3.5" />
              تصدير تقرير مجلس الإدارة
            </Button>
            <Button size="sm" variant="outline">
              إنشاء حزمة مجلس الإدارة
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="درجة الامتثال"
          value={`${kpiSummary.compliancePercent}%`}
          delta={kpiSummary.compliancePercentDelta}
          deltaLabel="%"
          icon={ShieldCheck}
          tone="success"
        />
        <KpiCard
          label="المخالفات المفتوحة"
          value={String(openViolations.length)}
          icon={Siren}
          tone="danger"
          invertDelta
        />
        <KpiCard
          label="المخاطر الحرجة"
          value={String(criticalRisks.length)}
          icon={AlertTriangle}
          tone="danger"
          invertDelta
        />
        <KpiCard
          label="إجمالي التعرض للمخاطر"
          value={`$${(totalExposure / 1e6).toFixed(0)}M`}
          icon={TrendingUp}
          tone="warning"
          invertDelta
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الوضع الامتثالي</CardTitle>
            <CardDescription className="text-xs">مؤشرات الصحة على مستوى المؤسسة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreCard label="الامتثال العام" value={kpiSummary.compliancePercent} color="success" />
            <ScoreCard label="امتثال الصناديق (متوسط)" value={avgFundCompliance} color={avgFundCompliance >= 80 ? "success" : "warning"} />
            <ScoreCard
              label="مخاطر العقود (معكوس)"
              value={100 - Math.round(violations.filter((v) => v.entityType === "contract").length * 15)}
              color="warning"
            />
            <ScoreCard label="دقة الوكلاء (متوسط)" value={97} color="success" />

            <Separator />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border bg-muted/30 p-2.5 text-center">
                <p className="text-lg font-bold text-primary">7/7</p>
                <p className="text-muted-foreground">وكلاء متصلون</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-2.5 text-center">
                <p className="text-lg font-bold">{kpiSummary.fundsMonitored}</p>
                <p className="text-muted-foreground">صناديق مراقبة</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-2.5 text-center">
                <p className="text-lg font-bold text-danger dark:text-red-400">{overdueRequests.length}</p>
                <p className="text-muted-foreground">طلبات متأخرة</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-2.5 text-center">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{urgentEvents.length}</p>
                <p className="text-muted-foreground">مواعيد عاجلة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الذكاء الاصطناعي — مطلوب إجراء تنفيذي</CardTitle>
            <CardDescription className="text-xs">
              قرارات ذات أولوية عالية تستلزم تدخلاً تنفيذياً أو من مجلس الإدارة، بحسب ما رصده وكيل الأوركيسترا.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {execRecommendations.map((rec, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${
                rec.priority === "critical" ? "border-danger/30 bg-danger/5" : "border-warning/25 bg-warning/5"
              }`}>
                <SeverityBadge value={rec.priority} />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold">{rec.action}</p>
                  <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">المسؤول: {rec.owner}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">المخالفات المفتوحة — نظرة مجلس الإدارة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {openViolations.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 rounded-md border p-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <SeverityBadge value={v.severity} />
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-xs font-medium truncate">{v.title}</p>
                </div>
                {v.financialExposure > 0 && (
                  <div className="shrink-0 text-right text-xs">
                    <p className="text-muted-foreground">التعرض</p>
                    <p className="font-semibold text-danger dark:text-red-400">
                      {formatCurrency(v.financialExposure, v.currency)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">امتثال الصناديق — نظرة مجلس الإدارة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funds.map((fund) => (
              <div key={fund.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{fund.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{formatCurrency(fund.aum, fund.currency)}</span>
                    <StatusBadge status={fund.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${fund.complianceScore >= 85 ? "bg-success" : fund.complianceScore >= 70 ? "bg-warning" : "bg-danger"}`}
                      style={{ width: `${fund.complianceScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold w-8 text-right ${
                    fund.complianceScore >= 85 ? "text-emerald-600 dark:text-emerald-400" :
                    fund.complianceScore >= 70 ? "text-amber-600 dark:text-amber-400" :
                    "text-danger dark:text-red-400"
                  }`}>{fund.complianceScore}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">المواعيد التنظيمية الحرجة القادمة</CardTitle>
          <CardDescription className="text-xs">مواعيد تستلزم إحاطة مجلس الإدارة خلال الـ90 يوماً القادمة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {urgentEvents.slice(0, 6).map((event) => {
              const isOverdue = event.status === "overdue";
              const days = Math.ceil((new Date(event.date).getTime() - new Date("2026-07-02").getTime()) / 86400000);
              return (
                <div key={event.id} className={`rounded-lg border p-3 space-y-1.5 ${isOverdue ? "border-danger/30 bg-danger/5" : "border-warning/25 bg-warning/5"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <SeverityBadge value={event.priority} />
                    <span className={`text-xs font-semibold ${isOverdue ? "text-danger dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {isOverdue ? `متأخر ${Math.abs(days)} يوم` : `${days} يوماً`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-snug">{event.title}</p>
                  {event.regulator && (
                    <p className="text-[11px] text-muted-foreground">{event.regulator}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
