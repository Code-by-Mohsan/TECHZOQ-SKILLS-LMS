"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Flame,
  Phone,
  Mail,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  PhoneCall,
  CalendarDays,
  ArrowRightLeft,
  ExternalLink,
  Filter,
  X,
} from "lucide-react";
import SlideDrawer from "@/components/SlideDrawer";
import Modal from "@/components/Modal";
import { LEAD_TYPES, LEAD_STATUSES, LEAD_SOURCES } from "@/lib/constants/leads";

/* ── Types ── */

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
  source: string;
  campaign?: string;
  tags?: string[];
  score?: number;
  temperature?: "hot" | "warm" | "cold";
  status?: string;
  interestPercentage?: number;
  interestCourses?: { _id: string; title: string }[];
  assignedTo?: { _id: string; name: string; email: string } | null;
  nextFollowUpAt?: string | null;
  preferredDate?: string | null;
  followUpStatus?: string;
  isConverted?: boolean;
  convertedToApplication?: string | null;
  notes?: string;
  message?: string;
  createdAt: string;
};

type Activity = {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  createdBy?: { name?: string };
};

type UserOption = { _id: string; name: string; email: string; role: string };
type CourseOption = { _id: string; title: string };

type SortKey = "name" | "createdAt" | "interestPercentage" | "temperature" | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 25;

/* ── Badge helpers ── */

const typeBadge: Record<string, string> = {
  counseling: "bg-emerald-100 text-emerald-700",
  demo: "bg-violet-100 text-violet-700",
  course_inquiry: "bg-sky-100 text-sky-700",
  general: "bg-slate-100 text-slate-700",
  job: "bg-orange-100 text-orange-700",
  internship: "bg-pink-100 text-pink-700",
  cospace: "bg-teal-100 text-teal-700",
  client: "bg-indigo-100 text-indigo-700",
};

const statusBadge: Record<string, string> = {
  lead: "bg-blue-100 text-blue-700",
  interested: "bg-emerald-100 text-emerald-700",
  not_interested: "bg-gray-200 text-gray-600",
  enrolled: "bg-purple-100 text-purple-800",
};

const tempBadge: Record<string, string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  cold: "bg-slate-100 text-slate-700",
};

function label(val: string) {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Component ── */

export default function AdminLeadsPage() {
  /* data state */
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* filters */
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterTemp, setFilterTemp] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /* sort & pagination */
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  /* drawers */
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  /* add-lead form */
  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    type: "general",
    source: "facebook_ads",
    campaign: "",
    interestCourseIds: [] as string[],
    assignedTo: "",
    interestPercentage: 0,
    temperature: "warm",
    nextFollowUpAt: "",
    notes: "",
  };
  const [newLead, setNewLead] = useState(emptyForm);

  /* detail drawer */
  const [activityInput, setActivityInput] = useState({ type: "note", message: "" });
  const [followUpNote, setFollowUpNote] = useState("");
  const [convertCourseId, setConvertCourseId] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "lead",
    temperature: "warm" as "hot" | "warm" | "cold",
    assignedTo: "",
    interestCourseIds: [] as string[],
    interestPercentage: 0,
    notes: "",
    nextFollowUpAt: "",
  });
  const [saving, setSaving] = useState(false);
  const [detailTab, setDetailTab] = useState<"details" | "followup">("details");

  /* ── Data loading ── */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const q = new URLSearchParams({ limit: "500" });
      if (filterType !== "all") q.set("type", filterType);
      if (filterStatus !== "all") q.set("status", filterStatus);
      if (filterTemp !== "all") q.set("temperature", filterTemp);
      if (dateFrom) q.set("from", dateFrom);
      if (dateTo) q.set("to", dateTo);

      const [leadRes, userRes, courseRes] = await Promise.all([
        fetch(`/api/admin/leads?${q.toString()}`),
        fetch("/api/admin/users?limit=100"),
        fetch("/api/admin/courses"),
      ]);
      const [leadJson, userJson, courseJson] = await Promise.all([
        leadRes.json(),
        userRes.json(),
        courseRes.json(),
      ]);

      // Always set users & courses even if leads fail
      setUsers(userJson.data?.users || []);
      setCourses(
        (courseJson.data || []).map((c: any) => ({ _id: c._id, title: c.title })),
      );

      if (!leadRes.ok) throw new Error(leadJson.message || "Failed to load leads");
      setLeads(leadJson.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, filterTemp, dateFrom, dateTo]);

  const loadActivities = useCallback(async (leadId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/activities`);
      const json = await res.json();
      if (res.ok) setActivities(json.data || []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedLead?._id) {
      loadActivities(selectedLead._id);
      setDetailTab("details");
      setEditForm({
        name: selectedLead.name || "",
        email: selectedLead.email || "",
        phone: selectedLead.phone || "",
        status: selectedLead.status || "lead",
        temperature: selectedLead.temperature || "warm",
        assignedTo: selectedLead.assignedTo?._id || "",
        interestCourseIds: selectedLead.interestCourses?.map((c) => c._id) || [],
        interestPercentage: selectedLead.interestPercentage ?? 0,
        notes: selectedLead.notes || selectedLead.message || "",
        nextFollowUpAt: selectedLead.nextFollowUpAt
          ? new Date(selectedLead.nextFollowUpAt).toISOString().slice(0, 10)
          : "",
      });
      setConvertCourseId("");
    }
  }, [selectedLead?._id, loadActivities, selectedLead?.status, selectedLead?.assignedTo]);

  /* ── Filtered + sorted + paginated ── */

  const filtered = useMemo(() => {
    let list = leads;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q),
      );
    }
    if (filterSource !== "all") list = list.filter((l) => l.source === filterSource);
    if (filterAssignee !== "all") {
      if (filterAssignee === "unassigned") list = list.filter((l) => !l.assignedTo);
      else list = list.filter((l) => l.assignedTo?._id === filterAssignee);
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "createdAt")
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "interestPercentage") cmp = (a.interestPercentage ?? 0) - (b.interestPercentage ?? 0);
      else if (sortKey === "temperature") {
        const order = { hot: 3, warm: 2, cold: 1 };
        cmp = (order[a.temperature || "cold"] || 0) - (order[b.temperature || "cold"] || 0);
      } else if (sortKey === "status") cmp = (a.status || "").localeCompare(b.status || "");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [leads, search, filterSource, filterAssignee, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filterType, filterStatus, filterSource, filterTemp, filterAssignee, dateFrom, dateTo]);

  /* ── Stats ── */

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus = { lead: 0, interested: 0, not_interested: 0, enrolled: 0 };
    let hotCount = 0;
    let overdueCount = 0;
    let convertedCount = 0;
    for (const l of leads) {
      const s = (l.status || "lead") as keyof typeof byStatus;
      if (s in byStatus) byStatus[s]++;
      if (l.temperature === "hot") hotCount++;
      if (l.isConverted) convertedCount++;
      if (
        l.nextFollowUpAt &&
        new Date(l.nextFollowUpAt).getTime() < Date.now() &&
        l.followUpStatus !== "completed"
      )
        overdueCount++;
    }
    return { total, ...byStatus, hotCount, overdueCount, convertedCount };
  }, [leads]);

  /* ── Handlers ── */

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const onCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create lead");
      setNewLead(emptyForm);
      setShowAddDrawer(false);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
    }
  };

  const updateLead = async (leadId: string, body: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update lead");
      await loadData();
      if (selectedLead?._id === leadId) {
        const refreshRes = await fetch(`/api/admin/leads/${leadId}`);
        const refreshJson = await refreshRes.json();
        if (refreshRes.ok) setSelectedLead(refreshJson.data || null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    }
  };

  const saveLeadEdits = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: editForm.name,
        email: editForm.email || undefined,
        phone: editForm.phone,
        status: editForm.status,
        temperature: editForm.temperature,
        assignedTo: editForm.assignedTo || null,
        interestCourseIds: editForm.interestCourseIds,
        interestPercentage: editForm.interestPercentage,
        notes: editForm.notes,
        nextFollowUpAt: editForm.nextFollowUpAt ? new Date(editForm.nextFollowUpAt).toISOString() : null,
        followUpStatus: editForm.nextFollowUpAt ? "scheduled" : "not_scheduled",
      };
      await updateLead(selectedLead._id, body);
    } finally {
      setSaving(false);
    }
  };

  const addActivity = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead._id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityInput),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add activity");
      setActivityInput({ type: "note", message: "" });
      await loadActivities(selectedLead._id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add activity");
    }
  };

  const addFollowUpNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !followUpNote.trim()) return;
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead._id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "followup_note", message: followUpNote.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add note");
      setFollowUpNote("");
      await loadActivities(selectedLead._id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    }
  };

  const convertLead = async () => {
    if (!selectedLead || !convertCourseId) return;
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead._id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: convertCourseId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to convert lead");
      await loadData();
      const refreshRes = await fetch(`/api/admin/leads/${selectedLead._id}`);
      const refreshJson = await refreshRes.json();
      if (refreshRes.ok) setSelectedLead(refreshJson.data || null);
      await loadActivities(selectedLead._id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to convert lead");
    }
  };

  const openWhatsApp = async () => {
    if (!selectedLead?.phone) return;
    const text = encodeURIComponent(
      `Hi ${selectedLead.name}, this is TECHZOQ admissions support.`,
    );
    window.open(
      `https://wa.me/${selectedLead.phone.replace(/[^\d]/g, "")}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
    await fetch(`/api/admin/leads/${selectedLead._id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "whatsapp", message: "Opened WhatsApp chat from CRM" }),
    });
    await loadActivities(selectedLead._id);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterSource("all");
    setFilterTemp("all");
    setFilterAssignee("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    filterType !== "all" ||
    filterStatus !== "all" ||
    filterSource !== "all" ||
    filterTemp !== "all" ||
    filterAssignee !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  /* ── Render ── */

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads CRM</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage leads, track interest, and convert to applications
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddDrawer(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total", value: stats.total, cls: "bg-slate-50 text-slate-700" },
          { label: "New Leads", value: stats.lead, cls: "bg-blue-50 text-blue-700" },
          { label: "Interested", value: stats.interested, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Converted", value: stats.convertedCount, cls: "bg-green-50 text-green-700" },
          { label: "Hot Leads", value: stats.hotCount, cls: "bg-red-50 text-red-700" },
          { label: "Overdue F/U", value: stats.overdueCount, cls: "bg-amber-50 text-amber-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl px-4 py-3 ${s.cls}`}>
            <p className="text-xs font-medium opacity-75">{s.label}</p>
            <p className="text-xl font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center justify-between">
          {error}
          <button type="button" onClick={() => setError("")} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search + filter toggle */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
            hasActiveFilters
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
              !
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} leads</span>
      </div>

      {/* Expandable filter bar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {label(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Source</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="all">All</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Temperature</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
            >
              <option value="all">All</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Assignee</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unassigned">Unassigned</option>
              {users
                .filter((u) => ["admin", "counselor", "marketing_agent", "super_admin"].includes(u.role))
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">From</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">To</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    { key: "name" as SortKey, label: "Lead" },
                    { key: "status" as SortKey, label: "Status" },
                    { key: "temperature" as SortKey, label: "Temp" },
                    { key: "interestPercentage" as SortKey, label: "Interest" },
                    { key: "createdAt" as SortKey, label: "Date" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {/* Lead name + contact */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                          {lead.isConverted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-600 text-white">
                              Converted
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          {lead.phone && (
                            <span className="inline-flex items-center gap-0.5">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge[lead.status || "lead"] || statusBadge.lead}`}
                        >
                          {label(lead.status || "lead")}
                        </span>
                      </td>

                      {/* Temperature */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${tempBadge[lead.temperature || "cold"]}`}
                        >
                          <Flame className="w-3 h-3" />
                          {lead.temperature || "cold"}
                        </span>
                      </td>

                      {/* Interest Level */}
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                        {lead.interestPercentage ?? 0}%
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full ${typeBadge[lead.type || "general"] || typeBadge.general}`}
                        >
                          {label(lead.type || "general")}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {label(lead.source)}
                      </td>

                      {/* Assignee */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {lead.assignedTo?.name || (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>

                      {/* Courses */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {lead.interestCourses && lead.interestCourses.length > 0
                          ? lead.interestCourses.map((c) => c.title).join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Add Lead Drawer ── */}
      <SlideDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        title="Add New Lead"
      >
        <form onSubmit={onCreateLead} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Name *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={newLead.name}
              onChange={(e) => setNewLead((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newLead.email}
                onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Phone</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newLead.phone}
                onChange={(e) => setNewLead((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={newLead.type}
                onChange={(e) => setNewLead((p) => ({ ...p, type: e.target.value }))}
              >
                {LEAD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {label(t)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Source</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={newLead.source}
                onChange={(e) => setNewLead((p) => ({ ...p, source: e.target.value }))}
              >
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Campaign</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={newLead.campaign}
              onChange={(e) => setNewLead((p) => ({ ...p, campaign: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Temperature</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={newLead.temperature}
                onChange={(e) => setNewLead((p) => ({ ...p, temperature: e.target.value }))}
              >
                <option value="hot">🔥 Hot</option>
                <option value="warm">🌤 Warm</option>
                <option value="cold">❄️ Cold</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Next Follow-up</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={newLead.nextFollowUpAt}
                onChange={(e) => setNewLead((p) => ({ ...p, nextFollowUpAt: e.target.value }))}
              />
            </div>
          </div>

          {/* Multi-select courses */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Interested Courses
            </label>
            <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
              {courses.map((c) => (
                <label key={c._id} className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={newLead.interestCourseIds.includes(c._id)}
                    onChange={(e) => {
                      setNewLead((p) => ({
                        ...p,
                        interestCourseIds: e.target.checked
                          ? [...p.interestCourseIds, c._id]
                          : p.interestCourseIds.filter((id) => id !== c._id),
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  {c.title}
                </label>
              ))}
            </div>
          </div>

          {/* Interest percentage slider */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Interest Level: {newLead.interestPercentage}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={newLead.interestPercentage}
              onChange={(e) =>
                setNewLead((p) => ({ ...p, interestPercentage: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Assign to</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={newLead.assignedTo}
              onChange={(e) => setNewLead((p) => ({ ...p, assignedTo: e.target.value }))}
            >
              <option value="">Unassigned</option>
              {users
                .filter((u) =>
                  ["admin", "counselor", "marketing_agent", "super_admin"].includes(u.role),
                )
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={newLead.notes}
              onChange={(e) => setNewLead((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Create Lead
          </button>
        </form>
      </SlideDrawer>

      {/* ── Lead Detail Modal ── */}
      <Modal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        maxWidth="max-w-3xl"
      >
        {selectedLead && (
          <div className="space-y-5">
            {/* Badges row (read-only info) */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${typeBadge[selectedLead.type || "general"] || typeBadge.general}`}
              >
                {label(selectedLead.type || "general")}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {label(selectedLead.source)}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                Score: {selectedLead.score || 0}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                Created {new Date(selectedLead.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Tab buttons */}
            <div className="flex border-b border-gray-200">
              {(["details", "followup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                    detailTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "details" ? "Details" : "Follow-Up"}
                </button>
              ))}
            </div>

            {/* ── Details Tab ── */}
            {detailTab === "details" && (
              <div className="space-y-5">
                {/* Editable fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Phone</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editForm.status}
                      onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>{label(s)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Temperature</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editForm.temperature}
                      onChange={(e) => setEditForm((p) => ({ ...p, temperature: e.target.value as "hot" | "warm" | "cold" }))}
                    >
                      <option value="hot">🔥 Hot</option>
                      <option value="warm">🌤 Warm</option>
                      <option value="cold">❄️ Cold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Assignee</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editForm.assignedTo}
                      onChange={(e) => setEditForm((p) => ({ ...p, assignedTo: e.target.value }))}
                    >
                      <option value="">Unassigned</option>
                      {users
                        .filter((u) => ["admin", "counselor", "marketing_agent", "super_admin"].includes(u.role))
                        .map((u) => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Interest Level: {editForm.interestPercentage}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={editForm.interestPercentage}
                      onChange={(e) => setEditForm((p) => ({ ...p, interestPercentage: Number(e.target.value) }))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                {/* Interested courses */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Interested Courses</label>
                  <div className="border border-gray-300 rounded-lg p-2 max-h-36 overflow-y-auto space-y-1">
                    {courses.map((c) => (
                      <label key={c._id} className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                        <input
                          type="checkbox"
                          checked={editForm.interestCourseIds.includes(c._id)}
                          onChange={(e) => {
                            setEditForm((p) => ({
                              ...p,
                              interestCourseIds: e.target.checked
                                ? [...p.interestCourseIds, c._id]
                                : p.interestCourseIds.filter((id) => id !== c._id),
                            }));
                          }}
                          className="rounded border-gray-300"
                        />
                        {c.title}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Notes</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                {/* Save button */}
                <button
                  type="button"
                  onClick={saveLeadEdits}
                  disabled={saving}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {/* Convert to application */}
                {!selectedLead.isConverted && selectedLead.status !== "converted" ? (
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Convert to Application
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={convertCourseId}
                        onChange={(e) => setConvertCourseId(e.target.value)}
                      >
                        <option value="">Select course</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={convertLead}
                        disabled={!convertCourseId}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        Convert
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                    ✓ Converted to application
                  </div>
                )}
              </div>
            )}

            {/* ── Follow-Up Tab ── */}
            {detailTab === "followup" && (
              <div className="space-y-4">
                {/* Next follow-up + actions row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Next Follow-up</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.nextFollowUpAt}
                      onChange={(e) => setEditForm((p) => ({ ...p, nextFollowUpAt: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={saveLeadEdits}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      disabled={!editForm.phone}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Follow-Up Notes section */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Follow-Up Notes</h4>
                  </div>
                  <form onSubmit={addFollowUpNote} className="flex gap-2">
                    <textarea
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      rows={2}
                      placeholder="Write follow-up details, observations, or reminders..."
                      value={followUpNote}
                      onChange={(e) => setFollowUpNote(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="self-end px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Add Note
                    </button>
                  </form>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {activities.filter((a) => a.type === "followup_note").length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No follow-up notes yet.</p>
                    ) : (
                      activities
                        .filter((a) => a.type === "followup_note")
                        .map((a) => (
                          <div key={a._id} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <p className="text-sm text-gray-800">{a.message}</p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                              <span>{new Date(a.createdAt).toLocaleString()}</span>
                              {a.createdBy?.name && <span>by {a.createdBy.name}</span>}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Log Activity */}
                <div className="border-t border-gray-200 pt-4">
                  <form onSubmit={addActivity} className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 block">Log Activity</label>
                    <div className="flex gap-2">
                      <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={activityInput.type}
                        onChange={(e) => setActivityInput((p) => ({ ...p, type: e.target.value }))}
                      >
                        <option value="note">Note</option>
                        <option value="call">Call</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="meeting">Meeting</option>
                        <option value="email">Email</option>
                      </select>
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Activity details..."
                        value={activityInput.message}
                        onChange={(e) => setActivityInput((p) => ({ ...p, message: e.target.value }))}
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-900 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Timeline */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {activities.length === 0 ? (
                      <p className="text-xs text-gray-500">No activities yet.</p>
                    ) : (
                      activities.map((a) => (
                        <div key={a._id} className="border border-gray-200 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {a.type === "call" && <PhoneCall className="w-3 h-3" />}
                            {a.type === "whatsapp" && <MessageSquare className="w-3 h-3" />}
                            {a.type === "meeting" && <CalendarDays className="w-3 h-3" />}
                            {(a.type === "stage_change" || a.type === "status_change") && <ArrowRightLeft className="w-3 h-3" />}
                            <span className="font-medium">{a.type}</span>
                            <span>{new Date(a.createdAt).toLocaleString()}</span>
                            {a.createdBy?.name && (
                              <span className="text-gray-400">by {a.createdBy.name}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 mt-1">{a.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
