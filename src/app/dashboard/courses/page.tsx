"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock,
  BarChart,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface CourseData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  description?: string;
  thumbnail?: string;
}

interface MyApplication {
  course: { _id: string };
  status: string;
}

const statusBadge: Record<string, { label: string; cls: string }> = {
  pending: { label: "Applied", cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", cls: "bg-blue-100 text-blue-700" },
  fees_pending: { label: "Fees Pending", cls: "bg-orange-100 text-orange-700" },
  fees_submitted: { label: "Fees Submitted", cls: "bg-purple-100 text-purple-700" },
  enrolled: { label: "Enrolled", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
};

export default function DashboardCoursesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [myApps, setMyApps] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => (r.ok ? r.json() : { data: [] })),
      fetch("/api/applications/my").then((r) => (r.ok ? r.json() : { data: [] })),
    ])
      .then(([coursesJson, appsJson]) => {
        setCourses(coursesJson.data || []);
        setMyApps(appsJson.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAppStatus = (courseId: string) => {
    const app = myApps.find((a) => a.course?._id === courseId);
    return app ? app.status : null;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Browse Courses
        </h1>
        <p className="text-sm text-gray-500">
          Explore our courses and apply to start learning
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Course Grid */}
      {!loading && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const appStatus = getAppStatus(course._id);
            const badge = appStatus ? statusBadge[appStatus] : null;
            return (
              <div
                key={course._id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div className="relative h-36 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-md rounded-full">
                      {course.category}
                    </span>
                  </div>
                  {badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${badge.cls}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-3.5 h-3.5" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                  {appStatus ? (
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/student")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-semibold transition-colors"
                    >
                      View Status
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={`/apply?course=${course.slug}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition-colors"
                    >
                      Apply Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No courses found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter
          </p>
        </div>
      ) : null}
    </div>
  );
}
