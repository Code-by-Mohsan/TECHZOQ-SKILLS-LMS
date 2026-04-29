"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  Home,
  Wallet,
  CalendarCheck2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { normalizeRole } from "@/lib/constants/auth";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const data = await res.json();
      setUser(data.data);
    } catch {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

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
          <span className="text-sm text-gray-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const normalizedRole = normalizeRole(user.role);
  const sidebarLinks =
    normalizedRole === "instructor" || normalizedRole === "teaching_assistant"
      ? [
          { href: "/dashboard/instructor", label: "My Batches", icon: GraduationCap },
          { href: "/dashboard/instructor/attendance", label: "Attendance", icon: CalendarCheck2 },
          { href: "/dashboard/instructor/communications", label: "Communication", icon: MessageSquare },
          { href: "/dashboard/courses", label: "Browse Courses", icon: Search },
        ]
      : [
          { href: "/dashboard/student", label: "My Applications", icon: ClipboardList },
          { href: "/dashboard/courses", label: "Browse Courses", icon: Search },
          { href: "/dashboard/finance", label: "Finance", icon: Wallet },
          { href: "/dashboard/student/attendance", label: "Attendance", icon: CalendarCheck2 },
          { href: "/dashboard/student/communications", label: "Communication", icon: MessageSquare },
        ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => {}}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <Link href="/dashboard/student" className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="Techzoq"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
           
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Learning
          </p>
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
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
                  {active && (
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
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

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-gray-900 font-medium">
                {normalizedRole === "instructor" || normalizedRole === "teaching_assistant"
                  ? "Instructor Dashboard"
                  : "Student Dashboard"}
              </span>
            </div>
          </div>

          {/* User greeting */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Hi, {firstName}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
