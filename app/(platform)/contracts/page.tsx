import { AlertTriangle, CheckCircle2, FileSignature, TrendingUp, Upload } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { contracts } from "@/lib/mock";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-danger" :
    score >= 50 ? "bg-warning" :
    "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-6 text-right text-xs font-semibold">{score}</span>
    </div>
  );
}

export default function ContractsPage() {
  const total = contracts.length;
  const flagged = contracts.filter((c) => c.status === "flagged" || c.status === "rejected").length;
  const underReview = contracts.filter((c) => c.status === "under-review").length;
  const avgRisk = Math.round(contracts.reduce((s, c) => s + c.riskScore, 0) / contracts.length);
  const totalValue = contracts.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="العقود"
        description="مكتبة عقود مراجعة بالذكاء الاصطناعي. يتم تحليل كل عقد للكشف عن البنود المحفوفة بالمخاطر والالتزامات الناقصة والتعارضات التنظيمية."
        actions={
          <Button size="sm">
            <Upload className="h-3.5 w-3.5" />
            رفع عقد
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="إجمالي العقود" value={String(total)} icon={FileSignature} tone="default" />
        <KpiCard label="مُعلَّمة / مرفوضة" value={String(flagged)} icon={AlertTriangle} tone="danger" invertDelta />
        <KpiCard label="قيد المراجعة" value={String(underReview)} icon={TrendingUp} tone="warning" />
        <KpiCard label="متوسط درجة المخاطر" value={String(avgRisk)} icon={CheckCircle2} tone={avgRisk >= 60 ? "danger" : "success"} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">سجل العقود</CardTitle>
            <Badge variant="outline" className="text-[10px]">القيمة الإجمالية: {formatCurrency(totalValue, "USD")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العقد</TableHead>
                <TableHead>الطرف المقابل</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>درجة المخاطر</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileSignature className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs font-medium">{contract.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{contract.counterparty}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{contract.type}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={contract.status} /></TableCell>
                  <TableCell><RiskBar score={contract.riskScore} /></TableCell>
                  <TableCell className="text-right text-xs font-medium">{formatCurrency(contract.value, contract.currency)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(contract.expiryDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {contracts.filter((c) => c.riskyTerms.length > 0 || c.regulatoryConflicts.length > 0).map((contract) => (
          <Card key={contract.id} className={contract.riskScore >= 80 ? "border-danger/30" : contract.riskScore >= 50 ? "border-warning/30" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{contract.name}</CardTitle>
                  <CardDescription className="text-xs">{contract.counterparty} · {contract.type}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBar score={contract.riskScore} />
                  <StatusBadge status={contract.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{contract.summary}</p>

              {contract.regulatoryConflicts.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">التعارضات التنظيمية</p>
                  {contract.regulatoryConflicts.map((conflict, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border border-danger/20 bg-danger/5 p-2.5 text-xs">
                      <SeverityBadge value={conflict.severity} />
                      <div>
                        <p className="font-medium text-danger dark:text-red-400">{conflict.regulation}</p>
                        <p className="text-muted-foreground mt-0.5">{conflict.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {contract.riskyTerms.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">البنود المحفوفة بالمخاطر</p>
                  {contract.riskyTerms.map((term, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border p-2.5 text-xs">
                      <SeverityBadge value={term.severity} />
                      <div>
                        <p className="font-medium">{term.clause}</p>
                        <p className="text-muted-foreground mt-0.5">{term.issue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {contract.missingClauses.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">البنود الناقصة</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contract.missingClauses.map((clause) => (
                      <Badge key={clause} variant="outline" className="text-[10px] border-danger/30 text-danger dark:text-red-400">
                        {clause}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {contract.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">توصيات الذكاء الاصطناعي</p>
                  <ul className="space-y-1">
                    {contract.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
