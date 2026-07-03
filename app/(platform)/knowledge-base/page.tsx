"use client";

import { useState } from "react";
import { Database, Globe, Loader2, RefreshCw, Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { knowledgeSources, knowledgeArticles } from "@/lib/mock";

const sourceColors: Record<string, string> = {
  CMA: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  SAMA: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  FSDP: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  "Saudi Exchange": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  "Fintech Saudi": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
  Internal: "bg-muted text-muted-foreground border-border",
};

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  score: number;
  article_ref?: string;
}

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 5 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results ?? []);
      setSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل البحث. تأكد من تشغيل الخادم الخلفي.");
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="قاعدة المعرفة"
        description="استخبارات تنظيمية مدعومة بـRAG. جميع المقالات مُضمَّنة ومُقسَّمة وقابلة للاسترجاع لقرارات الامتثال بالذكاء الاصطناعي مع استشهادات كاملة بالمصادر."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3.5 w-3.5" />
              مزامنة جميع المصادر
            </Button>
            <Button size="sm">
              + إضافة مصدر
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="مقالات مفهرسة" value="9" icon={Database} tone="default" />
        <KpiCard label="إجمالي المقاطع" value="3,897" icon={Database} tone="default" />
        <KpiCard label="المصادر" value="6" icon={Globe} tone="default" />
        <KpiCard label="المصادر المتزامنة" value="5/6" icon={RefreshCw} tone="warning" />
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-primary/5 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">خط أنابيب RAG نشط</p>
            <p className="text-xs text-muted-foreground">
              محمّل المستندات ← تقسيم ← تضمين (all-MiniLM-L6-v2) ← قاعدة بيانات qdrant المتجهية ← استرجاع ← qwen3.6-27b (Groq) ← محرك الاستشهادات
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">يعمل</span>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">مصادر المعرفة الرسمية</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {knowledgeSources.map((src) => (
            <Card key={src.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold bg-primary/10 text-primary">
                      P{src.priority}
                    </span>
                    <span className="text-sm font-semibold">{src.name.split(" (")[0]}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${src.status === "synced" ? "text-success border-success/30" : "text-amber-600 border-amber-500/30"}`}
                  >
                    {src.status === "synced" ? "متزامن" : "معلق"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{src.name}</p>
                <p className="text-xs text-muted-foreground">{src.articles} مقالة · تزامن {src.lastSync ? new Date(src.lastSync).toLocaleDateString("ar-SA-u-nu-latn", { day: "numeric", month: "short" }) : "—"}</p>
                <p className="text-[11px] text-primary/70 mt-1.5">{src.url}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">البحث الدلالي</CardTitle>
          <CardDescription className="text-xs">
            ابحث في قاعدة المعرفة باستخدام اللغة الطبيعية. النتائج مُرتَّبة حسب الصلة الدلالية باستخدام البحث المتجهي الحقيقي (Qdrant + sentence-transformers).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pr-9"
                placeholder="مثال: 'ما متطلبات هيئة السوق المالية لحوكمة صناديق الاستثمار؟'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "بحث"}
            </Button>
          </form>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              البحث في قاعدة البيانات المتجهية...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-1">
              <p className="text-xs text-danger font-medium">الخادم الخلفي غير متاح</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground font-mono">cd backend && uvicorn main:app --reload</p>
            </div>
          )}

          {searched && !loading && !error && results.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد نتائج لـ &ldquo;{query}&rdquo;.</p>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{results.length} نتائج لـ &ldquo;{query}&rdquo;</p>
              {results.map((r, i) => (
                <div key={r.id} className="rounded-lg border p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground">[{i + 1}]</span>
                      <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${sourceColors[r.source] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {r.source}
                      </span>
                      {r.article_ref && (
                        <Badge variant="outline" className="text-[10px]">{r.article_ref}</Badge>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {(r.score * 100).toFixed(1)}% تطابق
                    </span>
                  </div>
                  <p className="text-xs font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">جميع المقالات</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الوسوم</TableHead>
                <TableHead>آخر تحديث</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledgeArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-muted/40 cursor-pointer">
                  <TableCell className="text-xs font-medium max-w-[300px]">{article.title}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${sourceColors[article.source] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {article.source}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{article.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{article.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
