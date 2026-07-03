import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info" | "primary";

const toneMap: Record<string, Tone> = {
  active: "success",
  approved: "success",
  compliant: "success",
  processed: "success",
  resolved: "success",
  pass: "success",
  success: "success",
  mitigated: "success",
  normal: "success",
  completed: "success",

  pending: "info",
  "under-review": "info",
  processing: "info",
  monitoring: "info",
  invited: "info",
  info: "info",
  running: "info",

  warning: "warning",
  flagged: "warning",
  "needs-changes": "warning",
  "needs-review": "warning",
  outdated: "warning",
  "under-revision": "warning",
  "in-progress": "warning",
  draft: "warning",

  rejected: "danger",
  breach: "danger",
  failed: "danger",
  fail: "danger",
  escalated: "danger",
  blocked: "danger",
  offline: "danger",
  suspended: "danger",
  degraded: "warning",

  idle: "neutral",
  expired: "neutral",
  open: "warning",
  closed: "neutral",
};

const toneStyles: Record<Tone, string> = {
  success: "bg-success/15 text-emerald-700 dark:text-emerald-400 border-success/30",
  warning: "bg-warning/15 text-amber-700 dark:text-amber-400 border-warning/30",
  danger: "bg-danger/15 text-red-700 dark:text-red-400 border-danger/30",
  info: "bg-primary/10 text-primary border-primary/25",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/15 text-primary border-primary/30",
};

const labelMap: Record<string, string> = {
  active: "نشط",
  completed: "مكتمل",
  running: "جارٍ",
  approved: "معتمد",
  compliant: "ملتزم",
  processed: "مُعالَج",
  resolved: "محلول",
  pass: "ناجح",
  success: "نجاح",
  mitigated: "مخفَّف",
  normal: "طبيعي",

  pending: "معلّق",
  "under-review": "قيد المراجعة",
  processing: "قيد المعالجة",
  monitoring: "قيد المراقبة",
  invited: "مدعو",
  info: "معلومة",

  warning: "تحذير",
  flagged: "مُعلَّم",
  "needs-changes": "يتطلب تعديلات",
  "needs-review": "يتطلب مراجعة",
  outdated: "منتهي الصلاحية",
  "under-revision": "قيد المراجعة",
  "in-progress": "قيد التنفيذ",
  draft: "مسودة",

  rejected: "مرفوض",
  breach: "خرق",
  failed: "فشل",
  fail: "فشل",
  escalated: "تم التصعيد",
  blocked: "محظور",
  offline: "غير متصل",
  suspended: "موقوف",
  degraded: "متدهور",

  idle: "خامل",
  expired: "منتهي",
  open: "مفتوح",
  closed: "مغلق",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = toneMap[status] ?? "neutral";
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", toneStyles[tone], className)}
    >
      {labelMap[status] ?? status.replace(/-/g, " ")}
    </Badge>
  );
}
