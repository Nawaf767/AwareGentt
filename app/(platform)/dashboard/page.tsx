import { ShieldCheck, Siren, Clock3, FileSignature, Landmark, LineChart, BookOpenCheck, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { ComplianceTrendChart } from "@/components/dashboard/compliance-trend-chart";
import { ViolationsByCategoryChart } from "@/components/dashboard/violations-by-category-chart";
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap";
import { RecentAlertsCard } from "@/components/dashboard/recent-alerts-card";
import { AiRecommendationsCard } from "@/components/dashboard/ai-recommendations-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Button } from "@/components/ui/button";
import { kpiSummary } from "@/lib/mock";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم التنفيذية"
        description="الوضع الامتثالي في الوقت الفعلي عبر الأنظمة والعقود والصناديق والاستثمارات."
        actions={
          <Button size="sm" variant="outline">
            تصدير ملخص مجلس الإدارة
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="درجة الامتثال" value={`${kpiSummary.compliancePercent}%`} delta={kpiSummary.compliancePercentDelta} icon={ShieldCheck} tone="success" />
        <KpiCard label="مستوى المخاطر" value={kpiSummary.riskLevel} delta={-4} deltaLabel=" نقطة" icon={TrendingUp} tone="warning" invertDelta />
        <KpiCard label="المخالفات المفتوحة" value={String(kpiSummary.openViolations)} delta={kpiSummary.violationsDelta} deltaLabel="" icon={Siren} tone="danger" invertDelta />
        <KpiCard label="المراجعات المعلقة" value={String(kpiSummary.pendingReviews)} delta={2} deltaLabel="" icon={Clock3} tone="default" invertDelta />
        <KpiCard label="العقود قيد المراجعة" value={String(kpiSummary.contractsUnderReview)} icon={FileSignature} tone="default" />
        <KpiCard label="الصناديق المراقبة" value={String(kpiSummary.fundsMonitored)} icon={Landmark} tone="default" />
        <KpiCard label="قرارات الاستثمار اليوم" value={String(kpiSummary.investmentDecisionsToday)} icon={LineChart} tone="default" />
        <KpiCard label="تحديثات السياسات المعلقة" value={String(kpiSummary.policyUpdatesPending)} icon={BookOpenCheck} tone="default" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComplianceTrendChart />
        </div>
        <RiskHeatmap />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ViolationsByCategoryChart />
        <RecentAlertsCard />
        <AiRecommendationsCard />
      </div>

      <ActivityTimeline />
    </div>
  );
}
