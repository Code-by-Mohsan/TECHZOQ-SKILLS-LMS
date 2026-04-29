"use client";

import { useMemo, useState } from "react";

const REPORT_TYPES = [
  { key: "applications", label: "Applications Funnel" },
  { key: "finance", label: "Finance Collection" },
  { key: "communications", label: "Communication Activity" },
  { key: "attendance", label: "Attendance Summary" },
  { key: "referrals", label: "Referral Conversions" },
  { key: "leads", label: "Lead Funnel" },
];

export default function AdminReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const querySuffix = useMemo(() => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const text = params.toString();
    return text ? `&${text}` : "";
  }, [from, to]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Export</h1>
        <p className="text-sm text-gray-500 mt-1">Export operational reports to CSV with optional date filters.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From date</label>
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To date</label>
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
        {REPORT_TYPES.map((item) => (
          <a
            key={item.key}
            href={`/api/admin/reports/export?type=${item.key}${querySuffix}`}
            className="block border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500">Download `{item.key}` report CSV</p>
          </a>
        ))}
      </div>
    </div>
  );
}
