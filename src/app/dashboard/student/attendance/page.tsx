"use client";

import { useCallback, useEffect, useState } from "react";

interface AttendanceRecord {
  _id: string;
  status: "present" | "absent" | "late";
  remarks: string;
  createdAt: string;
  session?: { title?: string; topic?: string; startsAt?: string };
  batch?: { name?: string; course?: { title?: string } };
}

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/student/attendance");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load attendance");
      setRecords(json.data?.records || []);
      setStats(json.data?.stats || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Track your session-wise attendance history.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Present" value={stats.present} />
          <StatCard label="Late" value={stats.late} />
          <StatCard label="Absent" value={stats.absent} />
          <StatCard label="Attendance %" value={stats.percentage} />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Session History</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading attendance...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance records yet.</p>
        ) : (
          <div className="space-y-2">
            {records.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">{item.session?.title || "Session"}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.batch?.course?.title || ""} · {item.batch?.name || ""} ·{" "}
                  {item.session?.startsAt ? new Date(item.session.startsAt).toLocaleString() : ""}
                </p>
                {item.remarks && <p className="text-sm text-gray-700 mt-1">{item.remarks}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
