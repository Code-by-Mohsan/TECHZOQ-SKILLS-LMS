"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InstructorBatch {
  _id: string;
  assignmentType: string;
  enrollmentCount: number;
  batch?: {
    _id: string;
    name: string;
    status: string;
    startDate?: string;
    endDate?: string;
    course?: { title?: string; category?: string };
  };
}

export default function InstructorDashboardPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<InstructorBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/instructor/batches");
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setError(json.message || "Failed to load instructor dashboard");
        return;
      }
      setBatches(json.data || []);
    } catch {
      setError("Failed to load instructor dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">Loading instructor dashboard...</div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Assigned batches and student load</p>
      </div>

      {error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      ) : batches.length === 0 ? (
        <div className="p-8 bg-white border border-gray-200 rounded-xl text-sm text-gray-500">
          No batch assignments yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.batch?.name || "Batch"}
                </h2>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {item.assignmentType}
                </span>
              </div>
              <p className="text-sm text-gray-700">{item.batch?.course?.title || "—"}</p>
              <p className="text-xs text-gray-500 mt-1">{item.batch?.course?.category || ""}</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>Status: {item.batch?.status || "—"}</p>
                <p>Students: {item.enrollmentCount}</p>
                <p>
                  Start: {item.batch?.startDate ? new Date(item.batch.startDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

