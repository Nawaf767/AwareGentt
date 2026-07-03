import { Download, FileBarChart, FileSpreadsheet, FileText, Plus, Presentation } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { reports } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const formatIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  pptx: Presentation,
};

const typeColors: Record<string, string> = {
  regulatory: "bg-danger/10 text-danger border-danger/25",
  executive: "bg-primary/10 text-primary border-primary/25",
  board: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  audit: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  compliance: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
};

const typeAr: Record<string, string> = {
  regulatory: "تنظيمي",
  executive: "تنفيذي",
  board: "مجلس الإدارة",
  audit: "تدقيق",
  compliance: "امتثال",
};

export default function ReportsPage() {
  const total = reports.length;
  const thisMonth = reports.filter((r) => r.generatedAt.startsWith("2026-07")).length;
  const regulatory = reports.filter((r) => r.type === "regulatory").length;
  const board = reports.filter((r) => r.type === "board").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير"
        description="تقارير الامتثال والتدقيق التنفيذية والتنظيمية المُنشأة بالذكاء الاصطناعي. تُجمَّع التقارير تلقائياً من قِبَل وكيل التدقيق مع سلاسل أدلة كاملة."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              جدولة تقرير
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              إنشاء تقرير
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="إجمالي التقارير" value={String(total)} icon={FileBarChart} tone="default" />
        <KpiCard label="هذا الشهر" value={String(thisMonth)} icon={FileBarChart} tone="default" />
        <KpiCard label="التقديمات التنظيمية" value={String(regulatory)} icon={FileText} tone="default" />
        <KpiCard label="تقارير مجلس الإدارة" value={String(board)} icon={Presentation} tone="default" />
      </div>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
        {(["regulatory", "executive", "board", "audit", "compliance"] as const).map((type) => {
          const count = reports.filter((r) => r.type === type).length;
          return (
            <div key={type} className={`rounded-lg border p-3 ${typeColors[type]}`}>
              <p className="text-lg font-semibold">{count}</p>
              <p className="text-[11px] font-medium">{typeAr[type]}</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">مكتبة التقارير</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التقرير</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>التنسيق</TableHead>
                <TableHead>الفترة</TableHead>
                <TableHead>أنشأه</TableHead>
                <TableHead>أُنشئ</TableHead>
                <TableHead className="text-right">الحجم</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const FormatIcon = formatIcons[report.format] ?? FileText;
                return (
                  <TableRow key={report.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FormatIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-medium max-w-[260px]">{report.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-medium ${typeColors[report.type]}`}>
                        {typeAr[report.type] ?? report.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase">{report.format}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{report.period}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{report.generatedBy}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatRelativeTime(report.generatedAt)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {report.sizeKb >= 1024 ? `${(report.sizeKb / 1024).toFixed(1)} MB` : `${report.sizeKb} KB`}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs">
                        <Download className="h-3 w-3" />
                        تنزيل
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
