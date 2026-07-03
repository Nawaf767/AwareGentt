import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recommendations = [
  {
    id: "rec-1",
    agent: "وكيل التنبؤ بالمخاطر",
    text: "زيادة مخزون الأصول السائلة عالية الجودة بمقدار 120 مليون دولار لصندوق أطلس للدخل الثابت لتجنب الخرق المتوقع لنسبة تغطية السيولة خلال 30 يوماً.",
    priority: "critical",
  },
  {
    id: "rec-2",
    agent: "وكيل امتثال الاستثمار",
    text: "تقليص تخصيص Nimbus Robotics إلى 13.0 مليون دولار للبقاء ضمن حد التركز لمُصدر واحد.",
    priority: "high",
  },
  {
    id: "rec-3",
    agent: "وكيل ذكاء العقود",
    text: "إعادة التفاوض على بند الاختصاص القضائي في اتفاقية Solace Capital Markets للحفاظ على سبل انتصاف عملاء الاتحاد الأوروبي.",
    priority: "high",
  },
  {
    id: "rec-4",
    agent: "وكيل ذكاء السياسات",
    text: "تسريع مراجعة سياسة تعارض المصالح لتعكس الجداول الزمنية للإفصاح وفق SEC لعام 2026.",
    priority: "medium",
  },
];

const priorityTone: Record<string, string> = {
  critical: "bg-danger/15 text-danger border-danger/30",
  high: "bg-warning/15 text-amber-700 dark:text-amber-400 border-warning/30",
  medium: "bg-primary/10 text-primary border-primary/25",
};

const priorityLabel: Record<string, string> = {
  critical: "حرجة",
  high: "عالية",
  medium: "متوسطة",
};

export function AiRecommendationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          توصيات الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((r) => (
          <div key={r.id} className="rounded-lg border p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{r.agent}</span>
              <Badge variant="outline" className={priorityTone[r.priority]}>
                {priorityLabel[r.priority]}
              </Badge>
            </div>
            <p className="text-sm leading-snug">{r.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
