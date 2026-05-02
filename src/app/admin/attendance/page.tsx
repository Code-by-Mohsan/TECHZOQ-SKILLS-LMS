"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface SessionItem {
  _id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  batch?: { _id: string; name: string; course?: { title?: string } };
}

interface AttendanceItem {
  _id: string;
  status: "present" | "absent" | "late";
  remarks: string;
  createdAt: string;
  student?: { user?: { name?: string; email?: string } };
  session?: { title?: string; startsAt?: string };
  batch?: { name?: string };
}

export default function AdminAttendancePage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newSession, setNewSession] = useState({
    batchId: "",
    title: "",
    topic: "",
    startsAt: "",
    endsAt: "",
    meetingLink: "",
  });
  const [selectedSession, setSelectedSession] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionRes, attendanceRes] = await Promise.all([
        fetch("/api/admin/sessions"),
        fetch("/api/admin/attendance?limit=200"),
      ]);
      const [sessionJson, attendanceJson] = await Promise.all([sessionRes.json(), attendanceRes.json()]);
      if (!sessionRes.ok) throw new Error(sessionJson.message || "Failed to load sessions");
      if (!attendanceRes.ok) throw new Error(attendanceJson.message || "Failed to load attendance");
      setSessions(sessionJson.data || []);
      setRecords(attendanceJson.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load attendance module");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onCreateSession = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create session");
      setNewSession({ batchId: "", title: "", topic: "", startsAt: "", endsAt: "", meetingLink: "" });
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
  };

  const filteredRecords = selectedSession
    ? records.filter((item) => item.session && (item.session as any)._id === selectedSession)
    : records;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Operations</h1>
        <p className="text-sm text-gray-500 mt-1">Create sessions and monitor attendance records.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <form onSubmit={onCreateSession} className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          value={newSession.batchId}
          onChange={(event) => setNewSession((prev) => ({ ...prev, batchId: event.target.value }))}
          placeholder="Batch ID"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          value={newSession.title}
          onChange={(event) => setNewSession((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Session title"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          value={newSession.topic}
          onChange={(event) => setNewSession((prev) => ({ ...prev, topic: event.target.value }))}
          placeholder="Topic"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="datetime-local"
          value={newSession.startsAt}
          onChange={(event) => setNewSession((prev) => ({ ...prev, startsAt: event.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          type="datetime-local"
          value={newSession.endsAt}
          onChange={(event) => setNewSession((prev) => ({ ...prev, endsAt: event.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          value={newSession.meetingLink}
          onChange={(event) => setNewSession((prev) => ({ ...prev, meetingLink: event.target.value }))}
          placeholder="Meeting link (optional)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          Create Session
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Attendance Records</h2>
          <select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.title}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filteredRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance records found.</p>
        ) : (
          <div className="space-y-2">
            {filteredRecords.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.student?.user?.name || "Student"} · {item.status}
                </p>
                <p className="text-xs text-gray-500">
                  {item.batch?.name || "Batch"} · {item.session?.title || "Session"} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
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
