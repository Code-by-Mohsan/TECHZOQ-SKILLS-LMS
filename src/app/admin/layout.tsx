"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  ClipboardList,
  Calendar,
  GraduationCap,
  KeyRound,
  UserCheck,
  Wallet,
  MessageSquare,
  CalendarCheck2,
  TicketPercent,
  HandCoins,
  BarChart3,
  ContactRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { isAdminRole } from "@/lib/constants/auth";

interface UserData {
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, requiredPermissions: ["report.view"] },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, requiredPermissions: ["report.view"] },
  { href: "/admin/leads", label: "Leads CRM", icon: ContactRound, requiredPermissions: ["lead.manage"] },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, requiredPermissions: ["course.view"] },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList, requiredPermissions: ["application.review"] },
  { href: "/admin/batches", label: "Batches", icon: Calendar, requiredPermissions: ["batch.view"] },
  { href: "/admin/enrollments", label: "Enrollments", icon: UserCheck, requiredPermissions: ["enrollment.manage"] },
  { href: "/admin/finance", label: "Finance", icon: Wallet, requiredPermissions: ["finance.view"] },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent, requiredPermissions: ["coupon.create"] },
  { href: "/admin/referrals", label: "Referrals", icon: HandCoins, requiredPermissions: ["referral.manage"] },
  { href: "/admin/communication", label: "Communication", icon: MessageSquare, requiredPermissions: ["communication.view"] },
  { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck2, requiredPermissions: ["attendance.manage"] },
  {
    href: "/admin/demo-registrations",
    label: "Demo Registrations",
    icon: GraduationCap,
    requiredPermissions: ["application.review"],
  },
  { href: "/admin/users", label: "Users", icon: Users, requiredPermissions: ["user.view"] },
  { href: "/admin/audit", label: "Audit Logs", icon: Shield, requiredPermissions: ["audit.view"] },
  { href: "/admin/access", label: "Access Control", icon: KeyRound, requiredPermissions: ["rbac.manage"] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasPermission = useCallback((requiredPermissions: string[]) => {
    const granted = user?.permissions || [];
    if (granted.includes("*")) return true;
    return requiredPermissions.every((permission) => granted.includes(permission));
  }, [user]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const data = await res.json();
      if (!isAdminRole(data.data.role)) {
        toast.error("Admin access required");
        router.replace("/");
        return;
      }
      setUser(data.data);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.replace("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const allowedLinks = sidebarLinks.filter((link) => hasPermission(link.requiredPermissions));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => {}}
          role="presentation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Techzoq Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {allowedLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <link.icon
                  className={`w-5 h-5 ${active ? "text-blue-600" : "text-gray-400"}`}
                />
                {link.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-gray-700">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-medium capitalize">
                  {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
                </span>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
