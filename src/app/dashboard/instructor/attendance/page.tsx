"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AttendanceStatus = "present" | "absent" | "late";

interface SessionItem {
  _id: string;
  title: string;
  startsAt: string;
  batch?: { name?: string; course?: { title?: string } };
}

interface RosterItem {
  studentId: string;
  studentName: string;
  studentEmail: string;
  attendance: { status: AttendanceStatus; remarks?: string } | null;
}

export default function InstructorAttendancePage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [marks, setMarks] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/instructor/sessions");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load sessions");
      setSessions(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const loadRoster = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    try {
      setError("");
      const res = await fetch(`/api/instructor/sessions/${sessionId}/attendance`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load roster");
      const rosterItems = (json.data?.roster || []) as RosterItem[];
      setRoster(rosterItems);

      const nextMarks: Record<string, { status: AttendanceStatus; remarks: string }> = {};
      rosterItems.forEach((item) => {
        nextMarks[item.studentId] = {
          status: item.attendance?.status || "present",
          remarks: item.attendance?.remarks || "",
        };
      });
      setMarks(nextMarks);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load roster");
    }
  }, []);

  useEffect(() => {
    if (selectedSessionId) loadRoster(selectedSessionId);
  }, [selectedSessionId, loadRoster]);

  const selectedSession = useMemo(
    () => sessions.find((item) => item._id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  const saveAttendance = async () => {
    try {
      setError("");
      const records = Object.entries(marks).map(([studentId, value]) => ({
        studentId,
        status: value.status,
        remarks: value.remarks || undefined,
      }));
      const res = await fetch(`/api/instructor/sessions/${selectedSessionId}/attendance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSessionId, records }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save attendance");
      await loadRoster(selectedSessionId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save attendance");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Mark attendance for your assigned sessions.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select session</label>
        <select
          value={selectedSessionId}
          onChange={(event) => setSelectedSessionId(event.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Choose session</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.title} · {session.batch?.name || "Batch"}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading sessions...</div>
      ) : selectedSession && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{selectedSession.title}</h2>
              <p className="text-xs text-gray-500">
                {selectedSession.batch?.course?.title || ""} · {new Date(selectedSession.startsAt).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={saveAttendance}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Save Attendance
            </button>
          </div>

          {roster.length === 0 ? (
            <p className="text-sm text-gray-500">No active students in this batch.</p>
          ) : (
            <div className="space-y-3">
              {roster.map((item) => (
                <div key={item.studentId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.studentName}</p>
                      <p className="text-xs text-gray-500">{item.studentEmail}</p>
                    </div>
                    <select
                      value={marks[item.studentId]?.status || "present"}
                      onChange={(event) =>
                        setMarks((prev) => ({
                          ...prev,
                          [item.studentId]: {
                            status: event.target.value as AttendanceStatus,
                            remarks: prev[item.studentId]?.remarks || "",
                          },
                        }))
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  <input
                    value={marks[item.studentId]?.remarks || ""}
                    onChange={(event) =>
                      setMarks((prev) => ({
                        ...prev,
                        [item.studentId]: {
                          status: prev[item.studentId]?.status || "present",
                          remarks: event.target.value,
                        },
                      }))
                    }
                    placeholder="Remarks (optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
