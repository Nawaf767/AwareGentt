import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { riskHeatmap } from "@/lib/mock";

const bands = ["منخفض", "متوسط", "مرتفع"] as const;

function bandIndex(v: number) {
  if (v < 34) return 0;
  if (v < 67) return 1;
  return 2;
}

export function RiskHeatmap() {
  const grid: { category: string; probability: number; impact: number }[][][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => []),
  );

  riskHeatmap.forEach((r) => {
    const row = bandIndex(r.impact);
    const col = bandIndex(r.probability);
    grid[row][col].push(r);
  });

  const cellTone = (row: number, col: number) => {
    const score = row + col;
    if (score >= 3) return "bg-danger/20 border-danger/30";
    if (score === 2) return "bg-warning/20 border-warning/30";
    if (score === 1) return "bg-warning/10 border-warning/20";
    return "bg-success/10 border-success/20";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">خريطة حرارة المخاطر</CardTitle>
        <CardDescription>الاحتمالية مقابل التأثير على الأعمال عبر فئات المخاطر</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex w-6 flex-col-reverse justify-between text-[10px] text-muted-foreground">
            {bands.map((b) => (
              <span key={b} className="flex-1 flex items-center">
                {b[0]}
              </span>
            ))}
          </div>
          <div className="flex-1 space-y-1.5">
            {[2, 1, 0].map((row) => (
              <div key={row} className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((col) => (
                  <div
                    key={col}
                    className={cn(
                      "flex min-h-16 flex-wrap content-start gap-1 rounded-md border p-1.5",
                      cellTone(row, col),
                    )}
                  >
                    {grid[row][col].map((r) => (
                      <span
                        key={r.category}
                        className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium leading-tight shadow-sm"
                      >
                        {r.category}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
              {bands.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
            <p className="pt-0.5 text-center text-[10px] text-muted-foreground">← الاحتمالية</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
