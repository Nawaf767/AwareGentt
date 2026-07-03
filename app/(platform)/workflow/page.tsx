"use client";

import { useState } from "react";
import { CheckCircle2, GitBranch, Loader2, Play, Timer, XCircle, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workflowInstances } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const WORKFLOW_TYPES = [
  { value: "regulation-analysis", label: "تحليل اللوائح" },
  { value: "contract-review", label: "مراجعة امتثال العقود" },
  { value: "risk-assessment", label: "تقييم المخاطر التنبؤي" },
  { value: "investment-pre-trade", label: "فحص ما قبل تنفيذ الصفقة" },
  { value: "aml-investigation", label: "التحقيق في معاملات مكافحة غسل الأموال" },
  { value: "compliance-report", label: "إنشاء تقرير الامتثال" },
];

interface LiveStep {
  id: string;
  name: string;
  status: string;
  agent_id?: string;
  output?: string;
  duration_sec?: number;
}

interface LiveWorkflow {
  workflow_id: string;
  name: string;
  status: string;
  steps: LiveStep[];
  agents_invoked: string[];
  duration_sec?: number;
  final_output?: string;
}

const stepStatusStyles = {
  completed: { dot: "bg-success", line: "bg-success/50", text: "text-emerald-600 dark:text-emerald-400" },
  running: { dot: "bg-primary animate-pulse", line: "bg-primary/30", text: "text-primary" },
  pending: { dot: "bg-muted-foreground/30", line: "bg-muted-foreground/20", text: "text-muted-foreground" },
  failed: { dot: "bg-danger", line: "bg-danger/30", text: "text-danger dark:text-red-400" },
};

const stepStatusLabel: Record<string, string> = {
  completed: "مكتمل",
  running: "جارٍ",
  pending: "معلّق",
  failed: "فشل",
};

const agentShortNames: Record<string, string> = {
  "regulation-intelligence": "استخب. اللوائح",
  "contract-intelligence": "العقود",
  "investment-compliance": "الاستثمار",
  "real-time-monitoring": "المراقبة",
  "risk-prediction": "المخاطر",
  "policy-intelligence": "السياسات",
  "audit": "التدقيق",
};

export default function WorkflowPage() {
  const running = workflowInstances.filter((w) => w.status === "running").length;
  const completed = workflowInstances.filter((w) => w.status === "completed").length;
  const failed = workflowInstances.filter((w) => w.status === "failed").length;
  const completedWithDuration = workflowInstances.filter((w) => w.durationSec);
  const avgDuration = completedWithDuration.length
    ? Math.round(completedWithDuration.reduce((s, w) => s + (w.durationSec ?? 0), 0) / completedWithDuration.length)
    : 0;

  const [wfType, setWfType] = useState("regulation-analysis");
  const [entityRef, setEntityRef] = useState("");
  const [inputText, setInputText] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveResult, setLiveResult] = useState<LiveWorkflow | null>(null);
  const [liveError, setLiveError] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  async function handleRunWorkflow(e: React.FormEvent) {
    e.preventDefault();
    if (!entityRef.trim()) return;
    setLiveLoading(true);
    setLiveError("");
    setLiveResult(null);
    setShowOutput(false);
    try {
      const res = await fetch("/api/workflow/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_type: wfType,
          entity_ref: entityRef,
          input_data: { text: inputText || entityRef },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLiveResult(data);
    } catch (err: unknown) {
      setLiveError(err instanceof Error ? err.message : "فشل سير العمل. شغّل الخادم الخلفي: cd backend && uvicorn main:app --reload");
    } finally {
      setLiveLoading(false);
    }
  }

  function formatDuration(secs: number) {
    if (secs < 60) return `${secs}ث`;
    if (secs < 3600) return `${Math.floor(secs / 60)}د ${secs % 60}ث`;
    return `${Math.floor(secs / 3600)}س ${Math.floor((secs % 3600) / 60)}د`;
  }

  const sorted = [...workflowInstances].sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        title="محرك سير العمل"
        description="سير عمل امتثال متعدد الوكلاء. كل سير عمل يُنسِّق بين وكيل واحد أو أكثر بشكل متسلسل أو متوازٍ لإنجاز مهمة الامتثال."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="جارٍ" value={String(running)} icon={GitBranch} tone={running > 0 ? "warning" : "default"} />
        <KpiCard label="مكتمل" value={String(completed)} icon={CheckCircle2} tone="success" />
        <KpiCard label="فشل" value={String(failed)} icon={XCircle} tone={failed > 0 ? "danger" : "default"} invertDelta />
        <KpiCard label="متوسط المدة" value={formatDuration(avgDuration)} icon={Timer} tone="default" />
      </div>

      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">تشغيل سير عمل مباشر</CardTitle>
          </div>
          <CardDescription className="text-xs">
            شغّل سير عمل متعدد الوكلاء بشكل فعلي. يُنسِّق وكيل الأوركيسترا LangGraph بين الوكلاء، ويسترجع من قاعدة المعرفة عبر RAG، ويُرجع تقرير امتثال شاملاً.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRunWorkflow} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">نوع سير العمل</label>
                <Select value={wfType} onValueChange={(v) => v && setWfType(v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value} className="text-xs">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">الكيان / المرجع</label>
                <Input
                  className="h-8 text-xs"
                  placeholder="مثال: صندوق أطلس للدخل الثابت"
                  value={entityRef}
                  onChange={(e) => setEntityRef(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">سياق المدخلات (اختياري)</label>
              <Textarea
                className="text-xs min-h-[72px]"
                placeholder="الصق نص لائحة، أو مقطع عقد، أو تفاصيل معاملة ليحللها الوكلاء..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={liveLoading || !entityRef.trim()} className="gap-2">
              {liveLoading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" />جارٍ تشغيل سير العمل...</>
              ) : (
                <><Play className="h-3.5 w-3.5" />تشغيل سير العمل</>
              )}
            </Button>
          </form>

          {liveLoading && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <div className="text-xs">
                <p className="font-medium">الوكلاء يعملون...</p>
                <p className="text-muted-foreground">استرجاع RAG ← تنفيذ متعدد الوكلاء ← التوليف</p>
              </div>
            </div>
          )}

          {liveError && (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-1">
              <p className="text-xs text-danger font-medium">فشل سير العمل</p>
              <p className="text-xs text-muted-foreground">{liveError}</p>
            </div>
          )}

          {liveResult && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">{stepStatusLabel[liveResult.status] ?? liveResult.status}</Badge>
                  <span className="text-xs font-medium">{liveResult.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{liveResult.workflow_id}</span>
                </div>
                {liveResult.duration_sec && (
                  <span className="text-xs text-muted-foreground">المجموع: {formatDuration(Math.round(liveResult.duration_sec))}</span>
                )}
              </div>

              <div className="relative pl-4 space-y-0">
                {liveResult.steps.map((step, idx) => {
                  const isLast = idx === liveResult.steps.length - 1;
                  return (
                    <div key={step.id} className="relative flex gap-3 pb-3 last:pb-0">
                      {!isLast && <div className="absolute left-[5.5px] top-3.5 h-full w-0.5 bg-success/30" />}
                      <div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-success" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium">{step.name}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {step.agent_id && <span className="text-[10px] text-muted-foreground">{step.agent_id}</span>}
                            {step.duration_sec && <span className="text-[10px] font-mono text-muted-foreground">{step.duration_sec.toFixed(1)}ث</span>}
                            <span className="text-[10px] font-medium text-success">{stepStatusLabel[step.status] ?? step.status}</span>
                          </div>
                        </div>
                        {step.output && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{step.output}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">الوكلاء:</span>
                {liveResult.agents_invoked.map((a) => (
                  <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>
                ))}
              </div>

              {liveResult.final_output && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setShowOutput(!showOutput)}
                  >
                    {showOutput ? "إخفاء" : "عرض"} تقرير الامتثال الكامل
                  </Button>
                  {showOutput && (
                    <div className="rounded-lg border bg-muted/20 p-4 max-h-[500px] overflow-y-auto">
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">{liveResult.final_output}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sorted.map((wf) => (
          <Card key={wf.id} className={
            wf.status === "running" ? "border-primary/30" :
            wf.status === "failed" ? "border-danger/30" : ""
          }>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={wf.status} />
                    <Badge variant="outline" className="text-[10px]">{wf.type}</Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold">{wf.name}</CardTitle>
                  <CardDescription className="text-xs">
                    بواسطة {wf.triggeredBy} · {formatRelativeTime(wf.triggeredAt)}
                    {wf.durationSec && <> · المدة: {formatDuration(wf.durationSec)}</>}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {wf.agentsInvolved.map((agentId) => (
                    <Badge key={agentId} variant="outline" className="text-[10px]">
                      {agentShortNames[agentId] ?? agentId}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4">
                {wf.steps.map((step, index) => {
                  const styles = stepStatusStyles[step.status as keyof typeof stepStatusStyles] ?? stepStatusStyles.pending;
                  const isLast = index === wf.steps.length - 1;
                  return (
                    <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {!isLast && (
                        <div className={`absolute left-[5.5px] top-3.5 h-full w-0.5 ${styles.line}`} />
                      )}
                      <div className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full ${styles.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-medium ${step.status === "pending" ? "text-muted-foreground" : ""}`}>
                            {step.name}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {step.agentId && (
                              <span className="text-[10px] text-muted-foreground">{agentShortNames[step.agentId]}</span>
                            )}
                            {step.durationSec !== undefined && step.durationSec > 0 && (
                              <span className="text-[10px] text-muted-foreground font-mono">{formatDuration(step.durationSec)}</span>
                            )}
                            <span className={`text-[10px] font-medium ${styles.text}`}>{stepStatusLabel[step.status] ?? step.status}</span>
                          </div>
                        </div>
                        {step.output && (
                          <p className={`text-[11px] mt-0.5 ${styles.text}`}>{step.output}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
