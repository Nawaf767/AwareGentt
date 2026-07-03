"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronsUpDown, LogOut, Search, Settings, UserCircle } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems } from "@/lib/nav";
import { alerts } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";
import { SeverityBadge } from "@/components/severity-badge";

export function Topbar() {
  const pathname = usePathname();
  const current = navItems.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  const unacknowledged = alerts.filter((a) => !a.acknowledged).slice(0, 5);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="ml-1 h-5" />

      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>AwareGent</BreadcrumbLink>
          </BreadcrumbItem>
          {current && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{current.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative mr-2 hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="ابحث عن أنظمة، عقود، صناديق..." className="h-8 pr-8 text-sm" />
      </div>

      <div className="mr-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="hidden h-8 gap-1.5 text-xs sm:flex">
                بنك الانماء
                <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">المؤسسة</DropdownMenuLabel>
            <DropdownMenuItem>بنك الانماء</DropdownMenuItem>
            <DropdownMenuItem>أطلس كابيتال بارتنرز</DropdownMenuItem>
            <DropdownMenuItem>صندوق ميريديان للفرص</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">+ إضافة مؤسسة</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-4 w-4" />
                {unacknowledged.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" />
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              <span>التنبيهات الأخيرة</span>
              <Badge variant="outline" className="text-[10px]">{unacknowledged.length} جديد</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {unacknowledged.map((a) => (
              <DropdownMenuItem key={a.id} render={<Link href="/alerts" />} className="flex flex-col items-start gap-1 whitespace-normal py-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-xs font-medium leading-snug">{a.title}</span>
                  <SeverityBadge value={a.severity} />
                </div>
                <span className="text-[11px] text-muted-foreground">{formatRelativeTime(a.timestamp)}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/alerts" />} className="justify-center text-xs text-primary">
              عرض جميع التنبيهات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 gap-2 rounded-full px-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/15 text-[11px] text-primary">ن ر</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">نواف الريّس</span>
                <span className="text-xs font-normal text-muted-foreground">مدير النظام</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="h-4 w-4" /> الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />}>
              <Settings className="h-4 w-4" /> الإعدادات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="h-4 w-4" /> تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
