import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/severity-badge";
import { formatRelativeTime } from "@/lib/format";
import { alerts } from "@/lib/mock";

export function RecentAlertsCard() {
  const recent = alerts.slice(0, 5);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">التنبيهات الأخيرة</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" nativeButton={false} render={<Link href="/alerts" />}>
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-snug">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.source} · {formatRelativeTime(a.timestamp)}</p>
            </div>
            <SeverityBadge value={a.severity} className="shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
