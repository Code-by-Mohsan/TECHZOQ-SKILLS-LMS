"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  X,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

interface CourseInfo {
  _id: string;
  title: string;
}

interface BatchItem {
  _id: string;
  course: CourseInfo;
  name: string;
  startDate: string;
  endDate: string;
  maxStudents: number | null;
  status: string;
  enrollmentCount?: number;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  planned: "bg-indigo-100 text-indigo-700",
  open: "bg-blue-100 text-blue-700",
  full: "bg-amber-100 text-amber-700",
  running: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BatchItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    name: "",
    startDate: "",
    endDate: "",
    maxStudents: 30,
    status: "planned",
  });

  const fetchBatches = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterCourse) params.set("course", filterCourse);
      const res = await fetch(`/api/admin/batches?${params}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (json.success) setBatches(json.data || []);
    } catch {
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, [filterCourse, router]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    setLoading(true);
    fetchBatches();
  }, [fetchBatches]);

  const openCreate = () => {
    setEditing(null);
    setForm({ courseId: "", name: "", startDate: "", endDate: "", maxStudents: 30, status: "planned" });
    setShowModal(true);
  };

  const openEdit = (batch: BatchItem) => {
    setEditing(batch);
    setForm({
      courseId: batch.course._id,
      name: batch.name,
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
      maxStudents: batch.maxStudents ?? 30,
      status: batch.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.courseId || !form.name) {
      toast.error("Course and batch name are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/batches/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (res.ok) {
          toast.success("Batch updated");
          fetchBatches();
          setShowModal(false);
        } else {
          toast.error(json.message || "Failed to update");
        }
      } else {
        const res = await fetch("/api/admin/batches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (res.ok) {
          toast.success("Batch created");
          fetchBatches();
          setShowModal(false);
        } else {
          toast.error(json.message || "Failed to create");
        }
      }
    } catch {
      toast.error("Failed to save batch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (batchId: string, name: string) => {
    if (!confirm(`Delete batch "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/batches/${batchId}`, { method: "DELETE" });
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b._id !== batchId));
        toast.success("Batch deleted");
      } else {
        const json = await res.json();
        toast.error(json.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete batch");
    }
  };

  if (loading && batches.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage course batches</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Batch
        </button>
      </motion.div>

      {/* Course Filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
      </motion.div>

      {/* Empty State */}
      {batches.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No batches yet</h3>
          <p className="text-sm text-gray-500 mb-6">Create your first batch to get started</p>
        </motion.div>
      )}

      {/* Batches Table */}
      {batches.length > 0 && (
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Students</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{batch.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{batch.course?.title || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">
                      {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"} →{" "}
                      {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        {batch.enrollmentCount || 0}/{batch.maxStudents || "∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[batch.status] || statusColors.planned}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(batch)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(batch._id, batch.name)}
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

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? "Edit Batch" : "Create Batch"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Course *</label>
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Batch Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g., Batch 2025-A"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Max Students</label>
                    <input
                      type="number"
                      min={1}
                      value={form.maxStudents}
                      onChange={(e) => setForm((f) => ({ ...f, maxStudents: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="planned">Planned</option>
                      <option value="open">Open</option>
                      <option value="full">Full</option>
                      <option value="running">Running</option>
                      <option value="upcoming">Upcoming (Legacy)</option>
                      <option value="active">Active (Legacy)</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
