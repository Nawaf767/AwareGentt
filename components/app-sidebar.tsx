"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const overviewItems = navItems.filter((i) => i.group === "overview");
const complianceItems = navItems.filter((i) => i.group === "compliance");
const operationsItems = navItems.filter((i) => i.group === "operations");
const intelligenceItems = navItems.filter((i) => i.group === "intelligence");
const adminItems = navItems.filter((i) => i.group === "admin");

const BADGE_MAP: Record<string, { label: string; className: string }> = {
  "/violations": { label: "4", className: "bg-danger/20 text-danger" },
  "/alerts": { label: "3", className: "bg-warning/20 text-amber-500" },
  "/regulatory-requests": { label: "2", className: "bg-danger/20 text-danger" },
  "/tasks": { label: "3", className: "bg-warning/20 text-amber-500" },
};

function NavGroup({ label, items }: { label: string; items: typeof navItems }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const badge = BADGE_MAP[item.href];
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton render={<Link href={item.href} />} isActive={active} tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {badge && (
                  <SidebarMenuBadge className={badge.className}>{badge.label}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">AwareGent</span>
            <span className="text-[11px] text-sidebar-foreground/60">نظام الامتثال الوكيلي</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="نظرة عامة" items={overviewItems} />
        <NavGroup label="الامتثال" items={complianceItems} />
        <NavGroup label="العمليات" items={operationsItems} />
        <NavGroup label="الاستخبارات" items={intelligenceItems} />
        <NavGroup label="الإدارة" items={adminItems} />
      </SidebarContent>

      <SidebarFooter>
        <div className={cn("flex items-center gap-2 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center")}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-medium">جميع الوكلاء يعملون</span>
            <span className="text-[11px] text-sidebar-foreground/60">7/7 متصلون</span>
          </div>
          <Badge variant="outline" className="mr-auto group-data-[collapsible=icon]:hidden text-[10px]">
            v2.4.0
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
