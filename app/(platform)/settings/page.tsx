import { Bell, Key, Lock, Plus, Settings, Shield, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { orgUsers } from "@/lib/mock";
import { formatRelativeTime } from "@/lib/format";

const roleLabels: Record<string, string> = {
  "super-admin": "مدير النظام",
  "compliance-officer": "مسؤول الامتثال",
  "risk-manager": "مدير المخاطر",
  "auditor": "مدقق",
  "investment-manager": "مدير الاستثمار",
  "executive": "تنفيذي",
  "regulator": "منظِّم",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="إعداد المنصة وإدارة المستخدمين وتفضيلات الإشعارات والتكاملات وإعدادات الأمان."
      />

      <Tabs defaultValue="users">
        <TabsList className="h-9">
          <TabsTrigger value="users" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> المستخدمون والأدوار
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" /> الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" /> الأمان
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" /> التكاملات
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5 text-xs">
            <Key className="h-3.5 w-3.5" /> مفاتيح API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">مستخدمو المنصة</CardTitle>
                  <CardDescription className="text-xs">إدارة وصول المستخدمين والأدوار ومتطلبات المصادقة الثنائية.</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  دعوة مستخدم
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>المؤسسة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المصادقة الثنائية</TableHead>
                    <TableHead>آخر دخول</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div>
                          <p className="text-xs font-medium">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{roleLabels[user.role] ?? user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.organization}</TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${user.mfaEnabled ? "text-success" : "text-muted-foreground"}`}>
                          {user.mfaEnabled ? "مُفعَّلة" : "معطَّلة"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.lastLogin === "—" ? "—" : formatRelativeTime(user.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">إدارة</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">قنوات التنبيه</CardTitle>
                <CardDescription className="text-xs">تحديد قنوات تسليم تنبيهات الامتثال.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "تنبيهات البريد الإلكتروني", description: "المخالفات الحرجة والعالية الخطورة", enabled: true },
                  { label: "Microsoft Teams", description: "جميع إجراءات الوكلاء والأحداث المُعلَّمة", enabled: true },
                  { label: "Slack", description: "أحداث المراقبة في الوقت الفعلي", enabled: true },
                  { label: "رسائل SMS / واتساب", description: "التنبيهات الحرجة فقط", enabled: false },
                ].map((ch) => (
                  <div key={ch.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{ch.label}</p>
                      <p className="text-xs text-muted-foreground">{ch.description}</p>
                    </div>
                    <Switch defaultChecked={ch.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">عتبات الخطورة</CardTitle>
                <CardDescription className="text-xs">اختيار مستويات الخطورة التي تُطلق الإشعارات.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "حرجة", enabled: true },
                  { label: "عالية", enabled: true },
                  { label: "متوسطة", enabled: true },
                  { label: "منخفضة", enabled: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.label}</p>
                    <Switch defaultChecked={s.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">المصادقة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "إلزام المصادقة الثنائية لجميع المستخدمين", enabled: true },
                  { label: "تكامل SSO / SAML", enabled: false },
                  { label: "انتهاء الجلسة (30 دقيقة)", enabled: true },
                  { label: "قائمة السماح بعناوين IP", enabled: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.label}</p>
                    <Switch defaultChecked={s.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">البيانات والخصوصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "تشفير البيانات في وضع السكون (AES-256)", enabled: true },
                  { label: "التشفير الكامل أثناء النقل", enabled: true },
                  { label: "الاحتفاظ بسجل التدقيق (7 سنوات)", enabled: true },
                  { label: "تسجيل قابلية شرح قرارات الذكاء الاصطناعي", enabled: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.label}</p>
                    <Switch defaultChecked={s.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Microsoft Teams", status: "connected", description: "تنبيهات الامتثال وإشعارات سير العمل" },
              { name: "Slack", status: "connected", description: "تدفق أحداث المراقبة في الوقت الفعلي" },
              { name: "SharePoint", status: "connected", description: "مكتبة المستندات للعقود والسياسات" },
              { name: "Power BI", status: "connected", description: "تضمين لوحة التحكم التنفيذية للامتثال" },
              { name: "Azure Active Directory", status: "connected", description: "تسجيل الدخول الموحد وتزويد المستخدمين" },
              { name: "SWIFT", status: "disconnected", description: "تكامل مراقبة المعاملات" },
            ].map((int) => (
              <Card key={int.name}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={int.status} />
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {int.status === "connected" ? "إعداد" : "توصيل"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">مفاتيح API</CardTitle>
                  <CardDescription className="text-xs">إدارة وصول API للتكاملات الخارجية والأتمتة.</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  مفتاح API جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "تكامل Power Automate", key: "ag_live_••••••••••••8a2f", scopes: ["read:reports", "read:alerts"], created: "2026-06-01", lastUsed: "2026-07-01" },
                { name: "خط أنابيب BI الداخلي", key: "ag_live_••••••••••••c7d1", scopes: ["read:violations", "read:risks", "read:kpis"], created: "2026-05-15", lastUsed: "2026-07-01" },
                { name: "وصول قراءة الجهة التنظيمية — FCA", key: "ag_live_••••••••••••3e9b", scopes: ["read:reports", "read:audit"], created: "2026-06-10", lastUsed: "2026-06-25" },
              ].map((apiKey) => (
                <div key={apiKey.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{apiKey.name}</p>
                    <code className="text-xs text-muted-foreground font-mono">{apiKey.key}</code>
                    <div className="flex gap-1">
                      {apiKey.scopes.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-xs text-muted-foreground">
                      <p>آخر استخدام {apiKey.lastUsed}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-danger hover:text-danger">إلغاء</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
