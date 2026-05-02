"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

interface TemplateItem {
  _id: string;
  name: string;
  body: string;
  channel: "whatsapp" | "email" | "sms" | "in_app";
  variables: string[];
  isActive: boolean;
}

interface CommunicationItem {
  _id: string;
  message: string;
  sourceModule: string;
  status: string;
  recipientPhone: string;
  senderUser?: { name?: string };
  recipientUser?: { name?: string };
  createdAt: string;
}

export default function AdminCommunicationPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [logs, setLogs] = useState<CommunicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [message, setMessage] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [sourceModule, setSourceModule] = useState("general");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [templateRes, logRes] = await Promise.all([
        fetch("/api/admin/communication/templates"),
        fetch("/api/admin/communication/logs?limit=50"),
      ]);
      const [templateJson, logJson] = await Promise.all([templateRes.json(), logRes.json()]);

      if (!templateRes.ok) throw new Error(templateJson.message || "Failed to load templates");
      if (!logRes.ok) throw new Error(logJson.message || "Failed to load communication logs");

      setTemplates(templateJson.data || []);
      setLogs(logJson.data?.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load communication data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeTemplates = useMemo(() => templates.filter((item) => item.isActive), [templates]);

  const onTemplateCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/communication/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          channel: "whatsapp",
          body: templateBody,
          variables: [],
          isActive: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create template");
      setTemplateName("");
      setTemplateBody("");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create template");
    }
  };

  const onLogCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/communication/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientPhone,
          sourceModule,
          templateId: selectedTemplate || undefined,
          message,
          status: "opened_in_whatsapp",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to log communication");
      const waUrl = json.data?.waUrl as string | undefined;
      if (waUrl) window.open(waUrl, "_blank", "noopener,noreferrer");
      setMessage("");
      setRecipientPhone("");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create communication log");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/communication/logs/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update status");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update log status");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication CRM</h1>
        <p className="text-sm text-gray-500 mt-1">Manage templates and WhatsApp communication logs.</p>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={onTemplateCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Create Template</h2>
          <input
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            placeholder="Template name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
          <textarea
            value={templateBody}
            onChange={(event) => setTemplateBody(event.target.value)}
            placeholder="Message body"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Save Template
          </button>
        </form>

        <form onSubmit={onLogCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Log Send Action</h2>
          <input
            value={recipientPhone}
            onChange={(event) => setRecipientPhone(event.target.value)}
            placeholder="Recipient phone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
          <select
            value={sourceModule}
            onChange={(event) => setSourceModule(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="general">General</option>
            <option value="admissions">Admissions</option>
            <option value="finance">Finance</option>
            <option value="batches">Batches</option>
          </select>
          <select
            value={selectedTemplate}
            onChange={(event) => {
              const templateId = event.target.value;
              setSelectedTemplate(templateId);
              const template = activeTemplates.find((item) => item._id === templateId);
              if (template) setMessage(template.body);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">No template</option>
            {activeTemplates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
            Open WhatsApp + Log
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Logs</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-500">No communication logs found.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.recipientUser?.name || item.recipientPhone || "Recipient"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.sourceModule} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <select
                    value={item.status}
                    onChange={(event) => updateStatus(item._id, event.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                  >
                    <option value="queued">Queued</option>
                    <option value="opened_in_whatsapp">Opened in WhatsApp</option>
                    <option value="marked_sent">Marked Sent</option>
                    <option value="failed">Failed</option>
                    <option value="skipped">Skipped</option>
                    <option value="not_attempted">Not Attempted</option>
                  </select>
                </div>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
