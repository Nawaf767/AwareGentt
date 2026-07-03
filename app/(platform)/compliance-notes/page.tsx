import { Pin, Plus, StickyNote } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { complianceNotes } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const categoryColors: Record<string, string> = {
  "قرار مجلس الإدارة": "bg-primary/10 text-primary border-primary/25",
  "مراقبة المخاطر": "bg-danger/10 text-danger border-danger/25",
  "غسل الأموال / الجرائم المالية": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
  "تحليل الفجوات التنظيمية": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  "استجابة تنظيمية": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  "تحقيق": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  "حوكمة الذكاء الاصطناعي": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
};

export default function ComplianceNotesPage() {
  const pinned = complianceNotes.filter((n) => n.pinned);
  const unpinned = complianceNotes.filter((n) => !n.pinned);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ملاحظات الامتثال"
        description="ملاحظات الامتثال الداخلية وتحديثات التحقيقات وقرارات مجلس الإدارة والإحاطات. جميع الملاحظات مُتتبَّعة بالإصدارات ومُدرجة في مسار التدقيق."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            ملاحظة جديدة
          </Button>
        }
      />

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{complianceNotes.length} ملاحظة</span>
        <span>·</span>
        <span>{pinned.length} مثبَّتة</span>
        <span>·</span>
        <span>{new Set(complianceNotes.map((n) => n.category)).size} فئات</span>
      </div>

      {pinned.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Pin className="h-3.5 w-3.5 text-primary" />
            مثبَّتة
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pinned.map((note) => (
              <Card key={note.id} className="border-primary/25 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[note.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {note.category}
                      </span>
                      <CardTitle className="text-sm font-semibold">{note.title}</CardTitle>
                    </div>
                    <Pin className="h-3.5 w-3.5 shrink-0 text-primary mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2.5">
                    <span>بواسطة {note.author}</span>
                    <span>محدَّثة {formatRelativeTime(note.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <StickyNote className="h-3.5 w-3.5" />
          جميع الملاحظات
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {unpinned.map((note) => (
            <Card key={note.id} className="cursor-pointer hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium w-fit ${categoryColors[note.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                  {note.category}
                </span>
                <CardTitle className="text-sm font-semibold mt-1.5">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{note.content}</p>
                {note.relatedEntity && (
                  <Badge variant="outline" className="text-[10px]">
                    مرجع: {note.relatedEntity}
                  </Badge>
                )}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2.5">
                  <span>بواسطة {note.author}</span>
                  <span>{formatRelativeTime(note.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
