"use client";

import { useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Loader2,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agents } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const outcomeStyles: Record<string, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
  info: "text-primary",
};

const outcomeDots: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-primary",
};

const AGENT_OPTIONS = [
  { value: "orchestrator", label: "الأوركيسترا (توجيه تلقائي)" },
  { value: "regulation-intelligence", label: "استخبارات اللوائح" },
  { value: "contract-intelligence", label: "استخبارات العقود" },
  { value: "investment-compliance", label: "امتثال الاستثمار" },
  { value: "real-time-monitoring", label: "المراقبة في الوقت الفعلي" },
  { value: "risk-prediction", label: "التنبؤ بالمخاطر" },
  { value: "policy-intelligence", label: "استخبارات السياسات" },
  { value: "audit", label: "وكيل التدقيق" },
];

interface Citation {
  source: string;
  article?: string;
  excerpt: string;
  relevance_score: number;
}

interface AgentResponse {
  agent: string;
  response: string;
  citations: Citation[];
  agents_invoked: string[];
  workflow_id: string;
}

export default function AgentsPage() {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalTasksToday = agents.reduce((s, a) => s + a.tasksToday, 0);
  const avgAccuracy = Math.round((agents.reduce((s, a) => s + a.accuracy, 0) / agents.length) * 10) / 10;
  const avgResponseMs = Math.round(agents.reduce((s, a) => s + a.avgResponseTimeMs, 0) / agents.length);

  const [query, setQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("orchestrator");
  const [contextDoc, setContextDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState("");
  const [showContext, setShowContext] = useState(false);

  async function handleQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const res = await fetch("/api/agents/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          agent: selectedAgent,
          context_document: contextDoc || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل استعلام الوكيل. شغّل الخادم الخلفي: cd backend && uvicorn main:app --reload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="وكلاء الذكاء الاصطناعي"
        description="سبعة وكلاء امتثال مستقلون يعملون في الوقت الفعلي. كل وكيل يراقب ويحلل ويُطبِّق الامتثال في نطاق تخصصه."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="وكلاء متصلون" value={`${activeCount}/7`} icon={Bot} tone="success" />
        <KpiCard label="المهام اليوم" value={totalTasksToday.toLocaleString("ar-SA-u-nu-latn")} icon={Zap} tone="default" />
        <KpiCard label="متوسط الدقة" value={`${avgAccuracy}%`} icon={CheckCircle2} tone="success" />
        <KpiCard label="متوسط الاستجابة" value={`${(avgResponseMs / 1000).toFixed(1)}s`} icon={Clock} tone="default" />
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">وكيل الأوركيسترا — المتحكم الرئيسي</CardTitle>
              <CardDescription className="text-xs">
                يوجه الطلبات عبر جميع الوكلاء بواسطة LangGraph، ويشغّل سير عمل متوازية، ويدمج المخرجات، ويحل التعارضات، ويصدر قرارات الامتثال النهائية.
              </CardDescription>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">يعمل</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">اسأل وكيلاً — استعلام مباشر</CardTitle>
          </div>
          <CardDescription className="text-xs">
            استعلم أي وكيل امتثال مباشرة. الأوركيسترا يوجه تلقائياً للمتخصص المناسب عبر LangGraph. الردود مستندة إلى قاعدة المعرفة التنظيمية عبر RAG.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleQuery} className="space-y-3">
            <div className="flex gap-2">
              <Select value={selectedAgent} onValueChange={(v) => v && setSelectedAgent(v)}>
                <SelectTrigger className="w-64 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowContext(!showContext)}
              >
                + لصق سياق المستند
                <ChevronDown className={`h-3 w-3 transition-transform ${showContext ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showContext && (
              <Textarea
                placeholder="الصق نص عقد أو مقطع تنظيمي أو أي مستند لتحليله بواسطة الوكيل..."
                className="text-xs min-h-[100px] font-mono"
                value={contextDoc}
                onChange={(e) => setContextDoc(e.target.value)}
              />
            )}

            <div className="flex gap-2">
              <Textarea
                placeholder="مثال: 'ما متطلبات هيئة السوق المالية للإقراض بين الصناديق؟' أو 'حلّل هذا العقد للكشف عن مخاطر الامتثال'"
                className="text-xs min-h-[72px] flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="self-end" disabled={loading || !query.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {loading && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <div className="text-xs">
                <p className="font-medium">الوكيل يعالج...</p>
                <p className="text-muted-foreground">استرجاع RAG ← توليد اللغة الكبير ← استخراج الاستشهادات</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-1">
              <p className="text-xs text-danger font-medium">الخادم الخلفي غير متاح</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <p className="text-xs font-mono text-muted-foreground">cd backend && uvicorn main:app --reload</p>
            </div>
          )}

          {response && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{response.agent}</Badge>
                  {response.agents_invoked.map((a) => (
                    <Badge key={a} variant="outline" className="text-[10px] bg-primary/5">{a}</Badge>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{response.workflow_id}</span>
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{response.response}</p>
              </div>

              {response.citations.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">المصادر</p>
                  {response.citations.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="text-muted-foreground font-mono shrink-0">[{i + 1}]</span>
                      <div>
                        <span className="font-medium">{c.source}</span>
                        {c.article && <span className="text-muted-foreground"> · {c.article}</span>}
                        <span className="text-muted-foreground"> · {(c.relevance_score * 100).toFixed(0)}% صلة</span>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{c.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {agents.map((agent) => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{agent.name}</CardTitle>
                    <CardDescription className="text-xs">{agent.role}</CardDescription>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border bg-muted/30 p-3 text-xs">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">وقت التشغيل</p>
                  <p className="font-semibold">{agent.uptime}%</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">المهام اليوم</p>
                  <p className="font-semibold">{agent.tasksToday.toLocaleString("ar-SA-u-nu-latn")}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">الدقة</p>
                  <p className="font-semibold">{agent.accuracy}%</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">متوسط الاستجابة</p>
                  <p className="font-semibold">{agent.avgResponseTimeMs >= 1000 ? `${(agent.avgResponseTimeMs / 1000).toFixed(1)}s` : `${agent.avgResponseTimeMs}ms`}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">دقة القرار</span>
                  <span className="font-medium">{agent.accuracy}%</span>
                </div>
                <Progress value={agent.accuracy} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">الإجراءات الأخيرة</p>
                <div className="space-y-2">
                  {agent.recentActions.map((action) => (
                    <div key={action.id} className="flex items-start gap-2 text-xs">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${outcomeDots[action.outcome]}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium leading-snug ${outcomeStyles[action.outcome]}`}>{action.summary}</p>
                        <p className="text-muted-foreground truncate">{action.target} · {formatRelativeTime(action.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>آخر نشاط {formatRelativeTime(agent.lastActivity)}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-normal">{agent.model}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
