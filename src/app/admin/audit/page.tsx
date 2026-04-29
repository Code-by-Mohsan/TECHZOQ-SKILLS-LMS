"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuditLogItem {
  _id: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  actorRole: string;
  success: boolean;
  createdAt: string;
}

export default function AuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
      });
      const res = await fetch(`/api/admin/audit?${params}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Failed to load audit logs");
        return;
      }
      setLogs(json.data.logs || []);
      setTotal(json.data.total || 0);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Explorer</h1>
        <p className="text-sm text-gray-500 mt-1">{total} events logged</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Entity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actor Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.module}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {log.entityType} / {log.entityId}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{log.actorRole}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.success ? "success" : "failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>Page {page}</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={logs.length < 25}
            onClick={() => setPage((current) => current + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

