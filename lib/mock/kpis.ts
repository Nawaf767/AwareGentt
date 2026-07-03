import { KpiTrendPoint } from "@/lib/types";

export const complianceTrend: KpiTrendPoint[] = [
  { date: "يناير", value: 88 },
  { date: "فبراير", value: 89 },
  { date: "مارس", value: 87 },
  { date: "أبريل", value: 90 },
  { date: "مايو", value: 91 },
  { date: "يونيو", value: 93 },
  { date: "يوليو", value: 94 },
];

export const violationsTrend: KpiTrendPoint[] = [
  { date: "يناير", value: 14 },
  { date: "فبراير", value: 11 },
  { date: "مارس", value: 16 },
  { date: "أبريل", value: 9 },
  { date: "مايو", value: 8 },
  { date: "يونيو", value: 6 },
  { date: "يوليو", value: 4 },
];

export const violationsByCategory = [
  { category: "التركز", count: 8 },
  { category: "الحوكمة", count: 5 },
  { category: "الجرائم المالية", count: 4 },
  { category: "قانوني / تعاقدي", count: 6 },
  { category: "السيولة", count: 3 },
  { category: "السلوك", count: 2 },
];

export const riskHeatmap = [
  { category: "السيولة", probability: 68, impact: 82 },
  { category: "التركز", probability: 54, impact: 60 },
  { category: "الحوكمة", probability: 41, impact: 35 },
  { category: "قانوني", probability: 47, impact: 55 },
  { category: "الجرائم المالية", probability: 33, impact: 45 },
  { category: "الوصول إلى السوق", probability: 22, impact: 30 },
  { category: "السلوك", probability: 18, impact: 25 },
];

export const kpiSummary = {
  compliancePercent: 94,
  compliancePercentDelta: 1.2,
  riskLevel: "مرتفع",
  riskLevelScore: 62,
  openViolations: 4,
  violationsDelta: -2,
  pendingReviews: 7,
  contractsUnderReview: 3,
  fundsMonitored: 4,
  investmentDecisionsToday: 5,
  policyUpdatesPending: 2,
};

export const timeline = [
  {
    id: "tl-1",
    time: "15:04",
    title: "تم حظر معاملة بواسطة وكيل المراقبة الفورية",
    description: "تم حظر الحوالة البرقية #WT-990214 بسبب نمط غير معتاد في الطرف المقابل.",
    kind: "danger" as const,
  },
  {
    id: "tl-2",
    time: "14:50",
    title: "تم رفض أمر استثمار",
    description: "تم رفض الأمر #IV-4471: تجاوز حد التركز.",
    kind: "danger" as const,
  },
  {
    id: "tl-3",
    time: "14:30",
    title: "صدر تنبؤ بمخاطر السيولة",
    description: "رصد وكيل التنبؤ بالمخاطر احتمالية 68% لخرق نسبة تغطية السيولة لصندوق أطلس للدخل الثابت.",
    kind: "warning" as const,
  },
  {
    id: "tl-4",
    time: "13:40",
    title: "تمت الموافقة على أمر استثمار",
    description: "تمت الموافقة على الأمر #IV-4468 — اجتاز جميع الفحوصات.",
    kind: "success" as const,
  },
  {
    id: "tl-5",
    time: "13:00",
    title: "تم إنشاء تقرير تنظيمي",
    description: "أنشأ وكيل التدقيق تقرير الربع الثاني 2026 لتقديمه إلى هيئة السلوك المالي البريطانية.",
    kind: "info" as const,
  },
];
