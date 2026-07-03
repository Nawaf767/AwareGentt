import {
  LayoutDashboard,
  Bot,
  ScrollText,
  FileSignature,
  Landmark,
  LineChart,
  BookOpenCheck,
  ShieldAlert,
  Siren,
  BellRing,
  Activity,
  FileBarChart,
  ClipboardCheck,
  Settings,
  CalendarDays,
  ListChecks,
  Inbox,
  Database,
  GitBranch,
  StickyNote,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  group: "overview" | "compliance" | "operations" | "intelligence" | "admin";
}

export const navItems: NavItem[] = [
  // نظرة عامة
  { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard, group: "overview" },
  { title: "التنفيذي", href: "/executive", icon: BarChart3, group: "overview" },

  // الامتثال
  { title: "وكلاء الذكاء الاصطناعي", href: "/agents", icon: Bot, group: "compliance" },
  { title: "الأنظمة واللوائح", href: "/regulations", icon: ScrollText, group: "compliance" },
  { title: "العقود", href: "/contracts", icon: FileSignature, group: "compliance" },
  { title: "الصناديق", href: "/funds", icon: Landmark, group: "compliance" },
  { title: "الاستثمارات", href: "/investments", icon: LineChart, group: "compliance" },
  { title: "السياسات", href: "/policies", icon: BookOpenCheck, group: "compliance" },
  { title: "المخاطر", href: "/risks", icon: ShieldAlert, group: "compliance" },
  { title: "المخالفات", href: "/violations", icon: Siren, group: "compliance" },

  // العمليات
  { title: "المراقبة", href: "/monitoring", icon: Activity, group: "operations" },
  { title: "التنبيهات", href: "/alerts", icon: BellRing, group: "operations" },
  { title: "التقويم", href: "/calendar", icon: CalendarDays, group: "operations" },
  { title: "المهام", href: "/tasks", icon: ListChecks, group: "operations" },
  { title: "الطلبات التنظيمية", href: "/regulatory-requests", icon: Inbox, group: "operations" },
  { title: "سير العمل", href: "/workflow", icon: GitBranch, group: "operations" },

  // الاستخبارات
  { title: "التقارير", href: "/reports", icon: FileBarChart, group: "intelligence" },
  { title: "قاعدة المعرفة", href: "/knowledge-base", icon: Database, group: "intelligence" },
  { title: "ملاحظات الامتثال", href: "/compliance-notes", icon: StickyNote, group: "intelligence" },
  { title: "سجل التدقيق", href: "/audit", icon: ClipboardCheck, group: "intelligence" },

  // الإدارة
  { title: "الإعدادات", href: "/settings", icon: Settings, group: "admin" },
];
