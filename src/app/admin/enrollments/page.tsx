"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EnrollmentItem {
  _id: string;
  status: string;
  enrolledAt: string;
  student?: { user?: { name?: string; email?: string } };
  course?: { title?: string };
  batch?: { _id: string; name?: string };
}

interface BatchItem {
  _id: string;
  name: string;
}

export default function AdminEnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferingId, setTransferingId] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enrollments");
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Failed to fetch enrollments");
        return;
      }
      setEnrollments(json.data.enrollments || []);
    } catch {
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleTransfer = async (enrollmentId: string, currentBatchId: string) => {
    const toBatchId = window.prompt("Enter target batch ID");
    if (!toBatchId || toBatchId === currentBatchId) return;

    setTransferingId(enrollmentId);
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}/transfer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toBatchId, reason: "Admin transfer" }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Transfer failed");
        return;
      }
      toast.success("Enrollment transferred");
      fetchEnrollments();
    } catch {
      toast.error("Transfer failed");
    } finally {
      setTransferingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage student enrollments and transfers</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading enrollments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enrolled At</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {enrollment.student?.user?.name || "—"}
                      <div className="text-xs text-gray-500">{enrollment.student?.user?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{enrollment.course?.title || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{enrollment.batch?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{enrollment.status}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(enrollment.enrolledAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={!enrollment.batch?._id || transferingId === enrollment._id}
                        onClick={() =>
                          handleTransfer(enrollment._id, enrollment.batch?._id || "")
                        }
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                      >
                        {transferingId === enrollment._id ? "Transferring..." : "Transfer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

