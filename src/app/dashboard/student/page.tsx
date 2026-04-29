"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  BarChart,
  CheckCircle2,
  ClipboardList,
  AlertCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  thumbnail: string;
}

interface BatchInfo {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface ApplicationData {
  _id: string;
  course: CourseInfo;
  batch: BatchInfo | null;
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "contacted"
    | "shortlisted"
    | "pending"
    | "approved"
    | "waitlisted"
    | "fee_pending"
    | "fees_pending"
    | "fees_submitted"
    | "enrolled"
    | "rejected"
    | "cancelled";
  feesPaid: boolean;
  statusNote: string;
  appliedAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100", icon: Clock },
  submitted: { label: "Submitted", color: "text-sky-700", bg: "bg-sky-100", icon: ClipboardList },
  under_review: { label: "Under Review", color: "text-indigo-700", bg: "bg-indigo-100", icon: Clock },
  contacted: { label: "Contacted", color: "text-cyan-700", bg: "bg-cyan-100", icon: CheckCircle2 },
  shortlisted: { label: "Shortlisted", color: "text-teal-700", bg: "bg-teal-100", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  approved: { label: "Approved", color: "text-blue-700", bg: "bg-blue-100", icon: CheckCircle2 },
  waitlisted: { label: "Waitlisted", color: "text-amber-700", bg: "bg-amber-100", icon: AlertCircle },
  fee_pending: { label: "Fee Pending", color: "text-orange-700", bg: "bg-orange-100", icon: DollarSign },
  fees_pending: { label: "Fees Pending", color: "text-orange-700", bg: "bg-orange-100", icon: DollarSign },
  fees_submitted: { label: "Fees Submitted", color: "text-purple-700", bg: "bg-purple-100", icon: DollarSign },
  enrolled: { label: "Enrolled", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
  cancelled: { label: "Cancelled", color: "text-gray-700", bg: "bg-gray-200", icon: XCircle },
};

export default function StudentDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard/student");
        const json = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          setError(json.message || "Failed to load dashboard");
          return;
        }
        setApplications(json.data.applications || []);
        if (json.data.user?.name) setUserName(json.data.user.name);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  const enrolledCount = applications.filter((a) => a.status === "enrolled").length;
  const approvedCount = applications.filter(
    (a) =>
      a.status === "approved" ||
      a.status === "shortlisted" ||
      a.status === "fee_pending" ||
      a.status === "fees_pending" ||
      a.status === "fees_submitted",
  ).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {userName ? `Welcome back, ${userName}` : "My Applications"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your course applications and enrollment status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-xs text-gray-500">Total Applications</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{approvedCount}</div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{enrolledCount}</div>
              <div className="text-xs text-gray-500">Enrolled</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      )}

      {!error && applications.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Browse our courses and apply to start your tech journey</p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/courses")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Browse Courses
          </button>
        </div>
      )}

      {applications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {applications.map((app) => {
              const course = app.course;
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-36 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-2 py-0.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" /> {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart className="w-3.5 h-3.5" />
                        <span>{course.level}</span>
                      </div>
                    </div>

                    {app.batch && (
                      <div className="mb-3 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium">Batch:</span> {app.batch.name}
                        {app.batch.startDate && (
                          <span className="ml-1">· Starts {new Date(app.batch.startDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}

                    {app.statusNote && (
                      <div className="mb-3 flex items-start gap-2 text-xs text-gray-600 bg-amber-50 rounded-lg px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{app.statusNote}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
