"use client";

import { useCallback, useEffect, useState } from "react";

interface CommunicationItem {
  _id: string;
  message: string;
  status: string;
  sourceModule: string;
  createdAt: string;
  senderUser?: { name?: string; email?: string };
}

export default function StudentCommunicationPage() {
  const [items, setItems] = useState<CommunicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/student/communications?limit=100");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load communication timeline");
      setItems(json.data?.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load communication timeline");
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
        <h1 className="text-2xl font-bold text-gray-900">Communication Timeline</h1>
        <p className="text-sm text-gray-500 mt-1">Review messages sent to you by staff and instructors.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {loading ? (
          <p className="text-sm text-gray-500">Loading timeline...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No communication records found.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">{item.senderUser?.name || "Staff"}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.sourceModule} · {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
