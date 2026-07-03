import { Bell, BellOff, BellRing, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { SeverityBadge } from "@/components/severity-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { alerts } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const channelLabels: Record<string, string> = {
  email: "البريد الإلكتروني",
  sms: "رسالة نصية",
  teams: "Teams",
  slack: "Slack",
};

const channelColors: Record<string, string> = {
  email: "bg-primary/10 text-primary border-primary/25",
  sms: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  teams: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  slack: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
};

export default function AlertsPage() {
  const unacknowledged = alerts.filter((a) => !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const high = alerts.filter((a) => a.severity === "high").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="التنبيهات"
        description="تنبيهات الامتثال الصادرة من وكلاء الذكاء الاصطناعي عبر جميع القنوات المراقبة. التنبيهات غير المُقرَّة تستلزم مراجعة."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <CheckCircle2 className="h-3.5 w-3.5" />
              تحديد الكل كمقروء
            </Button>
            <Button size="sm" variant="outline">
              إعدادات الإشعارات
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="غير مقروءة" value={String(unacknowledged.length)} icon={BellRing} tone="danger" invertDelta />
        <KpiCard label="حرجة" value={String(critical)} icon={Bell} tone="danger" invertDelta />
        <KpiCard label="عالية" value={String(high)} icon={Bell} tone="warning" invertDelta />
        <KpiCard label="مُقرَّة" value={String(acknowledged.length)} icon={CheckCircle2} tone="success" />
      </div>

      {unacknowledged.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
            </span>
            غير مُقرَّة ({unacknowledged.length})
          </h2>
          <div className="space-y-3">
            {unacknowledged.map((alert) => (
              <Card key={alert.id} className={
                alert.severity === "critical" ? "border-danger/40 bg-danger/5" :
                alert.severity === "high" ? "border-warning/40 bg-warning/5" : ""
              }>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <SeverityBadge value={alert.severity} />
                        <span className="text-[11px] text-muted-foreground">{alert.source}</span>
                        {alert.relatedEntity && (
                          <Badge variant="outline" className="text-[10px]">{alert.relatedEntity}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {formatRelativeTime(alert.timestamp)} · أُرسل عبر:
                        </span>
                        {alert.channels.map((ch) => (
                          <span key={ch} className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${channelColors[ch]}`}>
                            {channelLabels[ch]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0">
                      إقرار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <BellOff className="h-3.5 w-3.5" />
          مُقرَّة ({acknowledged.length})
        </h2>
        <div className="space-y-2">
          {acknowledged.map((alert) => (
            <Card key={alert.id} className="opacity-70">
              <CardContent className="flex items-start gap-4 p-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-success" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge value={alert.severity} />
                    <span className="text-xs font-medium">{alert.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{alert.source}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(alert.timestamp)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
