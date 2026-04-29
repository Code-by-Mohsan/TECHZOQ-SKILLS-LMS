"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  ClipboardList,
  CheckCircle,
  GraduationCap,
  ArrowUpRight,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  enrolledApplications: number;
  totalDemoRegistrations: number;
}

interface MonthlyData {
  month: string;
  applications?: number;
  users?: number;
}

interface CoursePopularity {
  name: string;
  applications: number;
}

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [applicationsByMonth, setApplicationsByMonth] = useState<MonthlyData[]>(
    [],
  );
  const [coursePopularity, setCoursePopularity] = useState<CoursePopularity[]>(
    [],
  );
  const [signupsByMonth, setSignupsByMonth] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.data.stats);
        setApplicationsByMonth(data.data.applicationsByMonth);
        setCoursePopularity(data.data.coursePopularity);
        setSignupsByMonth(data.data.signupsByMonth);
      } else {
        toast.error(data.message || "Failed to load analytics");
      }
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400 text-sm">
          Loading analytics...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Courses",
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: ClipboardList,
      gradient: "from-pink-500 to-pink-600",
    },
    {
      label: "Enrolled Students",
      value: stats?.enrolledApplications || 0,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
    },
    {
      label: "Demo Registrations",
      value: stats?.totalDemoRegistrations || 0,
      icon: GraduationCap,
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform overview and analytics
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { type: "applications", label: "Export Applications" },
            { type: "finance", label: "Export Finance" },
            { type: "communications", label: "Export Communication" },
            { type: "attendance", label: "Export Attendance" },
            { type: "referrals", label: "Export Referrals" },
            { type: "leads", label: "Export Leads" },
          ].map((item) => (
            <a
              key={item.type}
              href={`/api/admin/reports/export?type=${item.type}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Download className="w-3.5 h-3.5" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                Active
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {card.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Monthly Applications
          </h3>
          {applicationsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={applicationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="applications"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              No application data yet
            </div>
          )}
        </motion.div>

        {/* Course Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Course Popularity
          </h3>
          {coursePopularity.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={coursePopularity}
                  dataKey="applications"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, percent }) =>
                    `${(name as string).slice(0, 12)}${(name as string).length > 12 ? "\u2026" : ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {coursePopularity.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              No course data yet
            </div>
          )}
        </motion.div>

        {/* User Growth — full width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            User Growth
          </h3>
          {signupsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={signupsByMonth}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#userGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              No signup data yet
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
