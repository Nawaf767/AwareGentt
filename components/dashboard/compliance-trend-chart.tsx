"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { complianceTrend } from "@/lib/mock";

const config = {
  value: {
    label: "نسبة الامتثال %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ComplianceTrendChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">اتجاه درجة الامتثال</CardTitle>
        <CardDescription>نسبة الامتثال على مستوى المؤسسة، آخر 7 أشهر</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
          <AreaChart data={complianceTrend} margin={{ left: -20, right: 10 }}>
            <defs>
              <linearGradient id="fillCompliance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="value" type="monotone" fill="url(#fillCompliance)" stroke="var(--color-value)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
