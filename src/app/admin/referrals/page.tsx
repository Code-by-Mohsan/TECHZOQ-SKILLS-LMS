"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Gift,
  Plus,
  User,
  Mail,
  Tag,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
} from "lucide-react";

/* ── Applicant search picker ── */

interface ApplicantOption {
  email: string;
  name: string;
  course: string;
  phone: string;
}

interface ApplicationSearchItem {
  student?: { user?: { name?: string; email?: string }; phone?: string };
  course?: { title?: string };
}

function ApplicantPicker({
  label,
  icon,
  value,
  onSelect,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onSelect: (email: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApplicantOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchApplicants = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `/api/admin/applications?search=${encodeURIComponent(q)}&limit=8`,
      );
      const json = await res.json();
      if (res.ok && json.data) {
        const seen = new Set<string>();
        const opts: ApplicantOption[] = [];
        for (const app of json.data as ApplicationSearchItem[]) {
          const email = app.student?.user?.email;
          if (!email || seen.has(email)) continue;
          seen.add(email);
          opts.push({
            email,
            name: app.student?.user?.name || "—",
            course: app.course?.title || "—",
            phone: app.student?.phone || "",
          });
        }
        setResults(opts);
      }
    } catch {
      /* ignore */
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    onSelect("");
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchApplicants(val), 300);
  };

  const handlePick = (opt: ApplicantOption) => {
    setQuery(`${opt.name} — ${opt.email}`);
    onSelect(opt.email);
    setOpen(false);
    setResults([]);
  };

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // reset when value is cleared externally (e.g. form reset)
  useEffect(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {icon}
        {label}
      </label>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={placeholder || "Search by name or email..."}
          className="w-full border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
        {searching && (
          <Loader2
            size={14}
            className="absolute right-2.5 top-2.5 animate-spin text-gray-400"
          />
        )}
        {!searching && value && (
          <CheckCircle2
            size={14}
            className="absolute right-2.5 top-2.5 text-green-500"
          />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {results.map((opt) => (
            <button
              key={opt.email}
              type="button"
              onClick={() => handlePick(opt)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {opt.name}
              </div>
              <div className="text-xs text-gray-500">
                {opt.email} • {opt.course}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && !searching && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center text-xs text-gray-400">
          No applicants found
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */

interface ReferralCodeItem {
  _id: string;
  code: string;
  title: string;
  usedCount: number;
  usageLimit?: number;
  isActive: boolean;
  rewardDiscountType?: string;
  rewardDiscountValue?: number;
  ownerUser?: { name?: string; email?: string; role?: string };
  createdAt: string;
}

interface ReferralEventItem {
  _id: string;
  code: string;
  eventType: string;
  status: string;
  rewardDiscountAmount?: number;
  rewardDiscountType?: string;
  rewardAppliedAt?: string;
  createdAt: string;
  referrerUser?: { name?: string; email?: string };
  refereeUser?: { name?: string; email?: string };
}

export default function AdminReferralsPage() {
  const [codes, setCodes] = useState<ReferralCodeItem[]>([]);
  const [events, setEvents] = useState<ReferralEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Referral form
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    referrerEmail: "",
    refereeEmail: "",
    discountType: "flat" as "flat" | "percentage",
    discountValue: "",
    details: "",
  });

  // Legacy code form
  const [codeFormOpen, setCodeFormOpen] = useState(false);
  const [codeSubmitting, setCodeSubmitting] = useState(false);
  const [codeForm, setCodeForm] = useState({
    code: "",
    ownerUserId: "",
    title: "",
    rewardDiscountType: "" as "" | "flat" | "percentage",
    rewardDiscountValue: "",
  });

  const loadData = useCallback(async () => {
    try {
      const [codesRes, eventsRes] = await Promise.all([
        fetch("/api/admin/referrals/codes"),
        fetch("/api/admin/referrals/events"),
      ]);
      const [codesJson, eventsJson] = await Promise.all([codesRes.json(), eventsRes.json()]);
      if (!codesRes.ok) throw new Error(codesJson.message || "Failed to load referral codes");
      if (!eventsRes.ok) throw new Error(eventsJson.message || "Failed to load referral events");
      setCodes(codesJson.data || []);
      setEvents(eventsJson.data || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Add Referral (new flow) ── */
  const handleCreateReferral = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.referrerEmail) {
      toast.error("Select a referrer from the search results");
      return;
    }
    if (!form.refereeEmail) {
      toast.error("Select a referee from the search results");
      return;
    }
    const val = Number(form.discountValue);
    if (!Number.isFinite(val) || val <= 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/referrals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerEmail: form.referrerEmail.trim(),
          refereeEmail: form.refereeEmail.trim(),
          discountType: form.discountType,
          discountValue: val,
          details: form.details.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to create referral");
        return;
      }
      toast.success(
        `Referral created! ${json.data.referrerName} gets PKR ${json.data.discountAmount} discount`,
      );
      setForm({ referrerEmail: "", refereeEmail: "", discountType: "flat", discountValue: "", details: "" });
      setFormOpen(false);
      await loadData();
    } catch {
      toast.error("Failed to create referral");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Legacy code creation ── */
  const handleCreateCode = async (e: FormEvent) => {
    e.preventDefault();
    setCodeSubmitting(true);
    try {
      const res = await fetch("/api/admin/referrals/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...codeForm,
          rewardDiscountValue: codeForm.rewardDiscountValue ? Number(codeForm.rewardDiscountValue) : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create code");
      toast.success(`Code ${json.data.code} created`);
      setCodeForm({ code: "", ownerUserId: "", title: "", rewardDiscountType: "", rewardDiscountValue: "" });
      setCodeFormOpen(false);
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create code");
    } finally {
      setCodeSubmitting(false);
    }
  };

  function eventStatusBadge(status: string) {
    const map: Record<string, string> = {
      qualified: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      disqualified: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create referrals, manage codes, and track events.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setFormOpen(!formOpen); setCodeFormOpen(false); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Referral
          </button>
          <button
            type="button"
            onClick={() => { setCodeFormOpen(!codeFormOpen); setFormOpen(false); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Tag size={14} />
            Add Code
          </button>
        </div>
      </div>

      {/* Add Referral Form */}
      {formOpen && (
        <form
          onSubmit={handleCreateReferral}
          className="bg-white border border-blue-200 rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Gift size={16} className="text-blue-600" />
            Create Referral &amp; Auto-Apply Discount
          </h3>
          <p className="text-xs text-gray-500">
            The referrer will automatically receive the discount on their fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApplicantPicker
              label="Referrer (who referred — gets discount)"
              icon={<User size={12} className="inline mr-1" />}
              value={form.referrerEmail}
              onSelect={(email) => setForm((p) => ({ ...p, referrerEmail: email }))}
              placeholder="Search referrer by name or email..."
            />
            <ApplicantPicker
              label="Referee (who was referred)"
              icon={<Mail size={12} className="inline mr-1" />}
              value={form.refereeEmail}
              onSelect={(email) => setForm((p) => ({ ...p, refereeEmail: email }))}
              placeholder="Search referee by name or email..."
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Discount Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as "flat" | "percentage" }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
              >
                <option value="flat">Flat Amount (PKR)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Discount Value
              </label>
              <input
                type="number"
                min="1"
                value={form.discountValue}
                onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                placeholder={form.discountType === "percentage" ? "e.g. 10" : "e.g. 5000"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <FileText size={12} className="inline mr-1" />
              Details / Reason (optional)
            </label>
            <input
              type="text"
              value={form.details}
              onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
              placeholder="e.g. Referred a friend for Web Dev batch"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
              maxLength={500}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {submitting ? "Creating..." : "Create Referral & Apply Discount"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Legacy Code Form */}
      {codeFormOpen && (
        <form
          onSubmit={handleCreateCode}
          className="bg-white border border-gray-200 rounded-xl p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Tag size={14} className="text-gray-600" />
            Create Referral Code (manual)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={codeForm.code}
              onChange={(e) => setCodeForm((p) => ({ ...p, code: e.target.value }))}
              placeholder="Referral code"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              value={codeForm.ownerUserId}
              onChange={(e) => setCodeForm((p) => ({ ...p, ownerUserId: e.target.value }))}
              placeholder="Owner user ID"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              value={codeForm.title}
              onChange={(e) => setCodeForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Label"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={codeSubmitting}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50 w-fit"
            >
              {codeSubmitting ? "Creating..." : "Add Code"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={codeForm.rewardDiscountType}
              onChange={(e) =>
                setCodeForm((p) => ({ ...p, rewardDiscountType: e.target.value as "" | "flat" | "percentage" }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <option value="">No referrer reward</option>
              <option value="flat">Flat reward (PKR)</option>
              <option value="percentage">Percentage reward (%)</option>
            </select>
            {codeForm.rewardDiscountType && (
              <input
                type="number"
                min="1"
                value={codeForm.rewardDiscountValue}
                onChange={(e) => setCodeForm((p) => ({ ...p, rewardDiscountValue: e.target.value }))}
                placeholder={codeForm.rewardDiscountType === "percentage" ? "e.g. 10" : "e.g. 5000"}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            )}
          </div>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Total Codes</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{codes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Active Codes</p>
          <p className="text-xl font-bold text-green-700 mt-1">{codes.filter((c) => c.isActive).length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Total Events</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{events.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Rewards Applied</p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {events.filter((e) => e.status === "qualified").length}
          </p>
        </div>
      </div>

      {/* Referral Events Table */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <Users size={14} /> Referral Events
          </h2>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-gray-400 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Loading...
          </div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No referral events yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Code</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Referrer</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Referee</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Event</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Reward</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-medium text-blue-700">{ev.code}</td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {ev.referrerUser?.name || ev.referrerUser?.email || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {ev.refereeUser?.name || ev.refereeUser?.email || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{ev.eventType.replace(/_/g, " ")}</td>
                    <td className="px-4 py-2.5">
                      {ev.rewardDiscountAmount ? (
                        <span className="text-green-700 font-medium">
                          {ev.rewardDiscountType === "percentage"
                            ? `${ev.rewardDiscountAmount}% disc.`
                            : `PKR ${ev.rewardDiscountAmount.toLocaleString()}`}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">{eventStatusBadge(ev.status)}</td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {new Date(ev.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Referral Codes Table */}
      {/* <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <Tag size={14} /> Referral Codes
          </h2>
        </div>
        {codes.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No referral codes yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Code</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Owner</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Label</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Reward</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Used</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Active</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codes.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-medium text-blue-700">{item.code}</td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {item.ownerUser?.name || item.ownerUser?.email || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{item.title || "—"}</td>
                    <td className="px-4 py-2.5">
                      {item.rewardDiscountType && item.rewardDiscountValue ? (
                        <span className="text-green-700 font-medium">
                          {item.rewardDiscountType === "percentage"
                            ? `${item.rewardDiscountValue}%`
                            : `PKR ${item.rewardDiscountValue.toLocaleString()}`}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.usedCount}/{item.usageLimit || "∞"}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.isActive ? (
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section> */}
    </div>
  );
}
