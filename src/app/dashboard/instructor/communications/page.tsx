"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface StudentOption {
  userId: string;
  name: string;
  email: string;
  phone: string;
  batchName: string;
}

interface LogItem {
  _id: string;
  message: string;
  status: string;
  sourceModule: string;
  recipientPhone: string;
  createdAt: string;
  recipientUser?: { name?: string };
}

export default function InstructorCommunicationPage() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [recipientUserId, setRecipientUserId] = useState("");
  const [sourceModule, setSourceModule] = useState("batch_followup");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [studentsRes, logsRes] = await Promise.all([
        fetch("/api/instructor/students"),
        fetch("/api/instructor/communications"),
      ]);
      const [studentsJson, logsJson] = await Promise.all([studentsRes.json(), logsRes.json()]);
      if (!studentsRes.ok) throw new Error(studentsJson.message || "Failed to load students");
      if (!logsRes.ok) throw new Error(logsJson.message || "Failed to load communications");
      setStudents(studentsJson.data || []);
      setLogs(logsJson.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load communication panel");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const student = students.find((item) => item.userId === recipientUserId);
      const res = await fetch("/api/instructor/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUserId,
          recipientPhone: student?.phone || undefined,
          sourceModule,
          message,
          status: "opened_in_whatsapp",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to log message");
      const waUrl = json.data?.waUrl as string | undefined;
      if (waUrl) window.open(waUrl, "_blank", "noopener,noreferrer");
      setMessage("");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
        <p className="text-sm text-gray-500 mt-1">Send and track WhatsApp communication to assigned students.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <form onSubmit={onSend} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-gray-900">New message</h2>
        <select
          value={recipientUserId}
          onChange={(event) => setRecipientUserId(event.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        >
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={`${student.userId}-${student.batchName}`} value={student.userId}>
              {student.name} · {student.batchName}
            </option>
          ))}
        </select>
        <select
          value={sourceModule}
          onChange={(event) => setSourceModule(event.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="batch_followup">Batch Followup</option>
          <option value="attendance_alert">Attendance Alert</option>
          <option value="session_notice">Session Notice</option>
        </select>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          placeholder="Type your message"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          Open WhatsApp + Log
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Timeline</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No communication history yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.recipientUser?.name || item.recipientPhone || "Recipient"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.sourceModule} · {item.status} · {new Date(item.createdAt).toLocaleString()}
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
