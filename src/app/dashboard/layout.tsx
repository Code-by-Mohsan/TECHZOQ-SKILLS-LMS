"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
 import { 
  LayoutDashboard, 
  BookOpen, 
  FileEdit, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Bell,
  LogOut,
  Menu,
  Search,
  X,
  
} from "lucide-react";
import toast from "react-hot-toast";
import { normalizeRole } from "@/lib/constants/auth";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const normalizedRole = normalizeRole(user.role);

 

const sidebarLinks = [
  { 
    href: "/dashboard/student", 
    label: "Dashboard", 
    icon: LayoutDashboard 
  },
  { 
    href: "/dashboard/courses", 
    label: "My Courses", 
    icon: BookOpen // Search ki jagah BookOpen zyada real lagta hai
  },
  { 
    href: "/dashboard/assignment", 
    label: "Assignment", 
    icon: FileEdit // Wallet ki jagah File ya Edit icon
  },
  { 
    href: "/dashboard/student/progress", 
    label: "Progress", 
    icon: BarChart3 // Stats dikhane ke liye best hai
  },
  { 
    href: "/dashboard/student/message", 
    label: "Message", 
    icon: MessageSquare 
  },
  { 
    href: "/dashboard/student/fee-management", 
    label: "Fee-Management", 
    icon: CreditCard // Wallet se behtar CreditCard icon hai
  },
  { 
    href: "/dashboard/student/setting", 
    label: "Settings", 
    icon: Settings // Yahan Dashboard ki jagah Settings icon fix kiya hai
  },
];

  return (
    <div className="flex h-screen bg-[#F8F9FD]">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-full w-64 bg-[#1E1E2D] text-gray-400 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="text-white font-semibold text-lg tracking-wide">Lumen</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="text-[10px] uppercase font-bold text-gray-500 px-2 mb-2 tracking-widest">Menu</p>
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Help Box */}
        <div className="m-4 p-4 bg-[#2B2B3D] rounded-2xl">
          <p className="text-xs text-white font-medium">Need help?</p>
          <p className="text-[10px] text-gray-400 mt-1">Reach out to your academic advisor anytime.</p>
          <button className="w-full mt-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition">
            Contact Support
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mx-4 mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search courses, lessons, invoices..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{normalizedRole} • UI/UX Design</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}