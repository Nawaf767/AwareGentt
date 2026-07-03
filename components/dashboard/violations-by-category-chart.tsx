"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { violationsByCategory } from "@/lib/mock";

const config = {
  count: {
    label: "المخالفات",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ViolationsByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">المخالفات حسب الفئة</CardTitle>
        <CardDescription>المفتوحة والمحلولة خلال آخر 90 يوماً</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
          <BarChart data={violationsByCategory} layout="vertical" margin={{ left: 10, right: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
