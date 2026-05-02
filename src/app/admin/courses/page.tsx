"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  BarChart,
} from "lucide-react";
import toast from "react-hot-toast";

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  isPublished: boolean;
  thumbnail: string;
  applicationCount: number;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/admin/courses");
      const json = await res.json();
      if (res.ok) {
        setCourses(json.data);
      } else if (res.status === 401 || res.status === 403) {
        router.push("/login");
      }
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string, title: string) {
    if (!confirm(`Delete "${title}" and all its applications?`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
        toast.success("Course deleted");
      } else {
        const json = await res.json();
        toast.error(json.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete course");
    }
  }

  async function handleSeed() {
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        toast.success("Seed data created!");
        fetchCourses();
      } else {
        toast.error(json.message || "Failed to seed");
      }
    } catch {
      toast.error("Failed to seed data");
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage your learning platform courses
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSeed}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
          >
            Seed Sample Data
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/courses/new")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </div>
      </motion.div>

      {/* Empty State */}
      {courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No courses yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Create your first course or seed sample data
          </p>
        </motion.div>
      )}

      {/* Courses Table */}
      {courses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Applications
                        </th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((course) => (
                        <tr
                          key={course._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-10 h-10 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-gray-900">
                                  {course.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {course.duration}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <BarChart className="w-4 h-4" />
                              {course.level}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                              <Users className="w-4 h-4 text-gray-400" />
                              {course.applicationCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {course.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/courses/${course._id}?edit=true`,
                                  )
                                }
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(course._id, course.title)
                                }
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
    </div>
  );
}
