"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  X,
  DollarSign,
  CreditCard,
  Tag,
  Calendar,
  User,
  BookOpen,
  Gift,
  Users,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
interface StudentUser {
  name: string;
  email: string;
}

interface StudentInfo {
  _id: string;
  user: StudentUser;
  phone: string;
}

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
}

interface BatchInfo {
  _id: string;
  name: string;
}

interface ApplicationItem {
  _id: string;
  student: StudentInfo;
  course: CourseInfo;
  batch: BatchInfo | null;
  status: string;
  feesPaid: boolean;
  feeStatus: "unpaid" | "partially_paid" | "paid";
  statusNote: string;
  appliedAt: string;
}

interface DetailStudent {
  _id: string;
  user: { name: string; email: string };
  phone: string;
  address: string;
  city: string;
  education: { level: string; institution: string; degree: string; graduationYear: number } | null;
  dateOfBirth: string | null;
  gender: string | null;
  occupation: string | null;
}

interface DetailCourse {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  enrollmentFee: number;
}

interface DetailInvoice {
  _id: string;
  invoiceNumber: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  issuedAt: string;
  dueDate: string | null;
}

interface DetailPayment {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  verificationStatus: string;
  submittedAt: string;
  verifiedAt: string | null;
  financeRemarks: string;
  rejectionReason: string;
}

interface DetailCouponRedemption {
  _id: string;
  code: string;
  baseAmount: number;
  discountAmount: number;
  payableAmount: number;
  status: string;
  coupon: { code: string; title: string; discountType: string; discountValue: number } | null;
}

interface DetailAdminDiscount {
  _id: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  reason: string;
  givenBy: { name: string; email: string } | null;
  createdAt: string;
}

interface DetailHistoryEntry {
  _id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: { name: string; email: string } | null;
  statusNote: string;
  createdAt: string;
}

interface DetailInstallment {
  _id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
  paidAt: string | null;
}

interface DetailInstallmentPlan {
  _id: string;
  totalAmount: number;
  totalInstallments: number;
  installments: DetailInstallment[];
  status: string;
  createdBy: { name: string; email: string } | null;
  createdAt: string;
}

interface DetailReferralEvent {
  _id: string;
  code: string;
  referrerUser: { _id: string; name: string; email: string } | null;
  refereeUser: { name: string; email: string } | null;
  eventType: string;
  status: string;
  rewardDiscountType: string;
  rewardDiscountValue: number;
  rewardDiscountAmount: number;
  rewardAppliedTo: string | null;
  rewardAppliedAt: string | null;
  referralCode: { code: string; rewardDiscountType: string; rewardDiscountValue: number } | null;
  createdAt: string;
}

interface FeeSummary {
  courseFee: number;
  enrollmentFee: number;
  remainingFee: number;
  totalDiscount: number;
  netFee: number;
  totalInvoiced: number;
  totalPaid: number;
  totalDue: number;
  feeStatus: "unpaid" | "partially_paid" | "paid";
}

interface ApplicationDetail {
  application: {
    _id: string;
    student: DetailStudent;
    course: DetailCourse;
    batch: BatchInfo | null;
    status: string;
    feesPaid: boolean;
    statusNote: string;
    appliedAt: string;
    couponCode: string;
    referralCode: string;
    discountAmountSnapshot: number;
    payableAmountSnapshot: number;
  };
  history: DetailHistoryEntry[];
  invoices: DetailInvoice[];
  payments: DetailPayment[];
  couponRedemptions: DetailCouponRedemption[];
  adminDiscounts: DetailAdminDiscount[];
  installmentPlans: DetailInstallmentPlan[];
  referralEvents: DetailReferralEvent[];
  feeSummary: FeeSummary;
}

interface BatchOption {
  _id: string;
  name: string;
  course: string | { _id: string };
}

const statusOptions = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "submitted", label: "Submitted", color: "bg-sky-100 text-sky-700" },
  { value: "under_review", label: "Under Review", color: "bg-indigo-100 text-indigo-700" },
  { value: "contacted", label: "Contacted", color: "bg-cyan-100 text-cyan-700" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-teal-100 text-teal-700" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  { value: "waitlisted", label: "Waitlisted", color: "bg-amber-100 text-amber-700" },
  { value: "fee_pending", label: "Fee Pending", color: "bg-orange-100 text-orange-700" },
  { value: "fees_pending", label: "Fees Pending", color: "bg-orange-100 text-orange-700" },
  { value: "fees_submitted", label: "Fees Submitted", color: "bg-purple-100 text-purple-700" },
  { value: "enrolled", label: "Enrolled", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-200 text-gray-700" },
];

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "fees" | "history">("info");

  // Discount form state
  const [discountFormOpen, setDiscountFormOpen] = useState(false);
  const [submittingDiscount, setSubmittingDiscount] = useState(false);
  const [discountForm, setDiscountForm] = useState({ discountType: "flat" as "flat" | "percentage", discountValue: "", reason: "" });

  // Payment form state
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: "", paymentMethod: "cash", transactionReference: "", remarks: "" });

  // Installment plan builder state
  const [installmentFormOpen, setInstallmentFormOpen] = useState(false);
  const [submittingInstallments, setSubmittingInstallments] = useState(false);
  const [installmentRows, setInstallmentRows] = useState<{ amount: string; dueDate: string }[]>([{ amount: "", dueDate: "" }]);

  // Coupon assign state
  const [couponFormOpen, setCouponFormOpen] = useState(false);
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<{ _id: string; code: string; title: string; discountType: string; discountValue: number; isActive: boolean }[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState("");

  // Referral reward state
  const [submittingReferralReward, setSubmittingReferralReward] = useState<string | null>(null);
  const [deletingDiscountId, setDeletingDiscountId] = useState<string | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);

  // Invoice delete state
  const [invoiceDeleteTarget, setInvoiceDeleteTarget] = useState<{ _id: string; invoiceNumber: string } | null>(null);
  const [invoiceDeleteStep, setInvoiceDeleteStep] = useState<"confirm" | "password">("confirm");
  const [invoiceDeletePassword, setInvoiceDeletePassword] = useState("");
  const [deletingInvoice, setDeletingInvoice] = useState(false);

  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (filterCourse) params.set("course", filterCourse);
      if (filterStatus) params.set("status", filterStatus);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/admin/applications?${params}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
        setTotalPages(json.totalPages || 1);
      }
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [page, filterCourse, filterStatus, searchQuery, router]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data || []);
      }
    } catch {}
  }, []);

  const fetchBatches = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const json = await res.json();
        setBatches(json.data || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, [fetchCourses, fetchBatches]);

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [fetchApplications]);

  const updateApplication = async (
    appId: string,
    updates: { status?: string; feesPaid?: boolean; batchId?: string | null; statusNote?: string },
  ) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Application updated");
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, ...json.data } : a)),
        );
      } else {
        toast.error(json.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update application");
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-700";
  };

  const openDetail = async (appId: string) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailTab("info");
    setDetail(null);
    try {
      const res = await fetch(`/api/admin/applications/${appId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setDetail(json.data);
      } else {
        toast.error(json.message || "Failed to load details");
        setDetailOpen(false);
      }
    } catch {
      toast.error("Failed to load details");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  /** Re-fetch detail without resetting tab or clearing current data */
  const refreshDetail = async () => {
    if (!detail) return;
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setDetail(json.data);
      }
    } catch {
      // silent — data stays as-is
    }
  };

  const handleGiveDiscount = async () => {
    if (!detail) return;
    const value = Number(discountForm.discountValue);
    if (!value || value <= 0) { toast.error("Enter a valid discount value"); return; }
    if (!discountForm.reason.trim()) { toast.error("Enter a reason for the discount"); return; }
    setSubmittingDiscount(true);
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}/discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discountType: discountForm.discountType,
          discountValue: value,
          reason: discountForm.reason.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Discount applied successfully");
        setDiscountFormOpen(false);
        setDiscountForm({ discountType: "flat", discountValue: "", reason: "" });
        refreshDetail();
      } else {
        toast.error(json.message || "Failed to apply discount");
      }
    } catch {
      toast.error("Failed to apply discount");
    } finally {
      setSubmittingDiscount(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!detail) return;
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) { toast.error("Enter a valid amount"); return; }
    if (!paymentForm.transactionReference.trim()) { toast.error("Enter a transaction reference"); return; }
    setSubmittingPayment(true);
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          paymentMethod: paymentForm.paymentMethod,
          transactionReference: paymentForm.transactionReference.trim(),
          remarks: paymentForm.remarks.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Payment recorded successfully");
        setPaymentFormOpen(false);
        setPaymentForm({ amount: "", paymentMethod: "cash", transactionReference: "", remarks: "" });
        refreshDetail();
        fetchApplications();
      } else {
        toast.error(json.message || "Failed to record payment");
      }
    } catch {
      toast.error("Failed to record payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleCreateInstallmentPlan = async () => {
    if (!detail) return;
    const installments = installmentRows.map((r) => ({
      amount: Number(r.amount),
      dueDate: r.dueDate,
    }));
    const invalid = installments.some((i) => !i.amount || i.amount <= 0 || !i.dueDate);
    if (invalid) { toast.error("All installments need a valid amount and date"); return; }

    setSubmittingInstallments(true);
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}/installments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installments }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Installment plan created");
        setInstallmentFormOpen(false);
        setInstallmentRows([{ amount: "", dueDate: "" }]);
        refreshDetail();
      } else {
        toast.error(json.message || "Failed to create plan");
      }
    } catch {
      toast.error("Failed to create plan");
    } finally {
      setSubmittingInstallments(false);
    }
  };

  const openCouponForm = async () => {
    setCouponFormOpen(true);
    setDiscountFormOpen(false);
    setPaymentFormOpen(false);
    setSelectedCouponId("");
    try {
      const res = await fetch("/api/admin/coupons");
      const json = await res.json();
      if (json.success) {
        setAvailableCoupons(json.data.filter((c: { isActive: boolean }) => c.isActive));
      }
    } catch {
      toast.error("Failed to load coupons");
    }
  };

  const handleAssignCoupon = async () => {
    if (!detail || !selectedCouponId) { toast.error("Select a coupon"); return; }
    setSubmittingCoupon(true);
    try {
      const res = await fetch(`/api/admin/coupons/${selectedCouponId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: detail.application._id }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Coupon assigned successfully");
        setCouponFormOpen(false);
        setSelectedCouponId("");
        refreshDetail();
        fetchApplications();
      } else {
        toast.error(json.message || "Failed to assign coupon");
      }
    } catch {
      toast.error("Failed to assign coupon");
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    if (!detail) return;
    setDeletingDiscountId(discountId);
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}/discount/${discountId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Discount removed");
        refreshDetail();
        fetchApplications();
      } else {
        toast.error(json.message || "Failed to remove discount");
      }
    } catch {
      toast.error("Failed to remove discount");
    } finally {
      setDeletingDiscountId(null);
    }
  };

  const handleDeleteCoupon = async (redemptionId: string) => {
    if (!detail) return;
    setDeletingCouponId(redemptionId);
    try {
      const res = await fetch(`/api/admin/applications/${detail.application._id}/coupon/${redemptionId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Coupon removed");
        refreshDetail();
        fetchApplications();
      } else {
        toast.error(json.message || "Failed to remove coupon");
      }
    } catch {
      toast.error("Failed to remove coupon");
    } finally {
      setDeletingCouponId(null);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!detail || !invoiceDeleteTarget) return;
    setDeletingInvoice(true);
    try {
      const res = await fetch(
        `/api/admin/applications/${detail.application._id}/invoice/${invoiceDeleteTarget._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: invoiceDeletePassword }),
        },
      );
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Invoice deleted");
        setInvoiceDeleteTarget(null);
        setInvoiceDeleteStep("confirm");
        setInvoiceDeletePassword("");
        refreshDetail();
        fetchApplications();
      } else {
        toast.error(json.message || "Failed to delete invoice");
      }
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingInvoice(false);
    }
  };

  const handleApplyReferralReward = async (eventId: string, referrerUserId: string) => {
    if (!detail) return;
    setSubmittingReferralReward(eventId);
    try {
      // Find referrer's application to apply reward to
      const searchRes = await fetch(`/api/admin/applications?search=${encodeURIComponent(referrerUserId)}&limit=50`);
      const searchJson = await searchRes.json();
      const referrerApps = (searchJson.data || []) as ApplicationItem[];
      if (referrerApps.length === 0) {
        toast.error("No application found for the referrer");
        return;
      }
      // Use the first non-cancelled application
      const referrerApp = referrerApps.find((a) => a.status !== "cancelled" && a.status !== "rejected") || referrerApps[0];

      const res = await fetch(`/api/admin/applications/${detail.application._id}/referral-reward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralEventId: eventId,
          referrerApplicationId: referrerApp._id,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Referral reward applied to referrer");
        refreshDetail();
      } else {
        toast.error(json.message || "Failed to apply reward");
      }
    } catch {
      toast.error("Failed to apply referral reward");
    } finally {
      setSubmittingReferralReward(null);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage student course applications
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-xl border border-gray-200 p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
          <Filter className="w-4 h-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterCourse}
            onChange={(e) => { setFilterCourse(e.target.value); setPage(1); }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {applications.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No applications found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </motion.div>
      )}

      {/* Applications Table */}
      {applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {app.student?.user?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.student?.user?.email || "—"}
                        </p>
                        {app.student?.phone && (
                          <p className="text-xs text-gray-400">{app.student.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {app.course?.title || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplication(app._id, { status: e.target.value })
                        }
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusColor(app.status)}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(() => {
                        const fs = app.feeStatus || (app.feesPaid ? "paid" : "unpaid");
                        if (fs === "paid") {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </span>
                          );
                        }
                        if (fs === "partially_paid") {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                              Partial
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" /> Unpaid
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.batch?._id || ""}
                        onChange={(e) =>
                          updateApplication(app._id, {
                            batchId: e.target.value || null,
                          })
                        }
                        className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">No Batch</option>
                        {batches
                          .filter((b) =>
                            (typeof b.course === "string" ? b.course : b.course?._id) ===
                            app.course?._id,
                          )
                          .map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(app._id)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ===== Detail Modal ===== */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDetailOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-900">Application Details</h2>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
              </div>
            ) : detail ? (
              <div className="px-6 pb-6">
                {/* Tab Navigation */}
                <div className="flex gap-1 border-b border-gray-200 mt-4 mb-6">
                  {(["info", "fees", "history"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setDetailTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                        detailTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab === "info" ? "Applicant Info" : tab === "fees" ? "Fees & Payments" : "Status History"}
                    </button>
                  ))}
                </div>

                {/* ─── TAB: Applicant Info ─── */}
                {detailTab === "info" && (
                  <div className="space-y-6">
                    {/* Student Info */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.student?.user?.name || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.student?.user?.email || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.student?.phone || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">City:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.student?.city || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Address:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.student?.address || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gender:</span>{" "}
                          <span className="font-medium text-gray-900 capitalize">{detail.application.student?.gender || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date of Birth:</span>{" "}
                          <span className="font-medium text-gray-900">
                            {detail.application.student?.dateOfBirth
                              ? new Date(detail.application.student.dateOfBirth).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Education:</span>{" "}
                          <span className="font-medium text-gray-900">
                            {detail.application.student?.education?.level || "—"}
                            {detail.application.student?.education?.institution
                              ? ` — ${detail.application.student.education.institution}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <h3 className="text-sm font-bold text-gray-900">Course & Application</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Course:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.course?.title || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.course?.category || "—"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Batch:</span>{" "}
                          <span className="font-medium text-gray-900">{detail.application.batch?.name || "Not assigned"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>{" "}
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(detail.application.status)}`}>
                            {statusOptions.find((s) => s.value === detail.application.status)?.label || detail.application.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Applied:</span>{" "}
                          <span className="font-medium text-gray-900">{new Date(detail.application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        {detail.application.statusNote && (
                          <div className="md:col-span-2">
                            <span className="text-gray-500">Note:</span>{" "}
                            <span className="font-medium text-gray-900">{detail.application.statusNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: Fees & Payments ─── */}
                {detailTab === "fees" && (
                  <div className="space-y-6">
                    {/* Fee Summary Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-gray-900">Fee Summary</h3>
                        <span className={`ml-auto px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          detail.feeSummary.feeStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : detail.feeSummary.feeStatus === "partially_paid"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {detail.feeSummary.feeStatus === "paid" ? "Fully Paid" : detail.feeSummary.feeStatus === "partially_paid" ? "Partially Paid" : "Unpaid"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Course Fee</p>
                          <p className="text-lg font-bold text-gray-900">PKR {detail.feeSummary.courseFee.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Enrollment Fee</p>
                          <p className="text-lg font-bold text-gray-900">PKR {detail.feeSummary.enrollmentFee.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Part of total</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Discount</p>
                          <p className="text-lg font-bold text-green-600">
                            {detail.feeSummary.totalDiscount > 0 ? `− PKR ${detail.feeSummary.totalDiscount.toLocaleString()}` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Net Fee</p>
                          <p className="text-lg font-bold text-gray-900">PKR {detail.feeSummary.netFee.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Paid</p>
                          <p className="text-base font-bold text-green-600">PKR {detail.feeSummary.totalPaid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className={`text-base font-bold ${detail.feeSummary.totalDue > 0 ? "text-orange-600" : "text-green-600"}`}>
                            {detail.feeSummary.totalDue > 0 ? `PKR ${detail.feeSummary.totalDue.toLocaleString()}` : "Paid ✓"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => { setDiscountFormOpen(!discountFormOpen); setPaymentFormOpen(false); setCouponFormOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                      >
                        <Tag className="w-4 h-4" /> Give Discount
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentFormOpen(!paymentFormOpen); setDiscountFormOpen(false); setCouponFormOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        <CreditCard className="w-4 h-4" /> Record Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (couponFormOpen) { setCouponFormOpen(false); } else { openCouponForm(); } }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                      >
                        <Gift className="w-4 h-4" /> Assign Coupon
                      </button>
                    </div>

                    {/* Give Discount Form */}
                    {discountFormOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-green-50 rounded-xl p-5 border border-green-200"
                      >
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Give Direct Discount</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                              value={discountForm.discountType}
                              onChange={(e) => setDiscountForm((f) => ({ ...f, discountType: e.target.value as "flat" | "percentage" }))}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="flat">Flat Amount (PKR)</option>
                              <option value="percentage">Percentage (%)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {discountForm.discountType === "flat" ? "Amount (PKR)" : "Percentage (%)"}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={discountForm.discountType === "percentage" ? 100 : undefined}
                              value={discountForm.discountValue}
                              onChange={(e) => setDiscountForm((f) => ({ ...f, discountValue: e.target.value }))}
                              placeholder={discountForm.discountType === "flat" ? "e.g. 5000" : "e.g. 10"}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                            <input
                              type="text"
                              value={discountForm.reason}
                              onChange={(e) => setDiscountForm((f) => ({ ...f, reason: e.target.value }))}
                              placeholder="e.g. Early bird discount, sibling discount..."
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setDiscountFormOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleGiveDiscount}
                            disabled={submittingDiscount}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors"
                          >
                            {submittingDiscount ? "Applying..." : "Apply Discount"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Record Payment Form */}
                    {paymentFormOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-blue-50 rounded-xl p-5 border border-blue-200"
                      >
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Record Payment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Amount (PKR)</label>
                            <input
                              type="number"
                              min="1"
                              value={paymentForm.amount}
                              onChange={(e) => setPaymentForm((f) => ({ ...f, amount: e.target.value }))}
                              placeholder="e.g. 10000"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                              value={paymentForm.paymentMethod}
                              onChange={(e) => setPaymentForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="cash">Cash</option>
                              <option value="bank_transfer">Bank Transfer</option>
                              <option value="jazzcash_manual">JazzCash</option>
                              <option value="easypaisa_manual">EasyPaisa</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Reference</label>
                            <input
                              type="text"
                              value={paymentForm.transactionReference}
                              onChange={(e) => setPaymentForm((f) => ({ ...f, transactionReference: e.target.value }))}
                              placeholder="e.g. TXN-12345 or receipt number"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Remarks (optional)</label>
                            <input
                              type="text"
                              value={paymentForm.remarks}
                              onChange={(e) => setPaymentForm((f) => ({ ...f, remarks: e.target.value }))}
                              placeholder="Any additional notes..."
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setPaymentFormOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleRecordPayment}
                            disabled={submittingPayment}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                          >
                            {submittingPayment ? "Recording..." : "Record Payment"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Assign Coupon Form */}
                    {couponFormOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-amber-50 rounded-xl p-5 border border-amber-200"
                      >
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Assign Coupon</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Select Coupon</label>
                            <select
                              value={selectedCouponId}
                              onChange={(e) => setSelectedCouponId(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="">— Select a coupon —</option>
                              {availableCoupons.map((c) => (
                                <option key={c._id} value={c._id}>
                                  {c.code} — {c.title} ({c.discountType === "percentage" ? `${c.discountValue}%` : `PKR ${c.discountValue}`})
                                </option>
                              ))}
                            </select>
                          </div>
                          {selectedCouponId && (() => {
                            const sel = availableCoupons.find((c) => c._id === selectedCouponId);
                            if (!sel) return null;
                            const courseFee = detail.feeSummary.courseFee;
                            const est = sel.discountType === "percentage" ? (courseFee * sel.discountValue) / 100 : sel.discountValue;
                            return (
                              <div className="bg-white rounded-lg px-4 py-3 border border-amber-100 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500">Estimated discount:</span>
                                  <span className="font-bold text-green-600">− PKR {Math.round(est).toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setCouponFormOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAssignCoupon}
                            disabled={submittingCoupon || !selectedCouponId}
                            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 transition-colors"
                          >
                            {submittingCoupon ? "Assigning..." : "Assign Coupon"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Discounts */}
                    {(detail.couponRedemptions.some((cr) => cr.status !== "reversed") || detail.adminDiscounts.length > 0) && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-green-600" />
                          <h3 className="text-sm font-bold text-gray-900">Discounts Applied</h3>
                        </div>
                        <div className="space-y-2">
                          {detail.couponRedemptions.filter((cr) => cr.status !== "reversed").map((cr) => (
                            <div key={cr._id} className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                              <div>
                                <span className="font-medium text-gray-900">Coupon: {cr.code}</span>
                                {cr.coupon?.title && <span className="text-gray-500 ml-2">({cr.coupon.title})</span>}
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                                  cr.status === "consumed" ? "bg-green-100 text-green-700" : cr.status === "reserved" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {cr.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-green-600">− PKR {cr.discountAmount.toLocaleString()}</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteCoupon(cr._id); }}
                                  disabled={deletingCouponId === cr._id}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Remove coupon"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {detail.adminDiscounts.map((ad) => (
                            <div key={ad._id} className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                              <div>
                                <span className="font-medium text-gray-900">Admin Discount</span>
                                <span className="text-gray-500 ml-2">
                                  ({ad.discountType === "percentage" ? `${ad.discountValue}%` : `PKR ${ad.discountValue.toLocaleString()}`})
                                </span>
                                {ad.reason && <span className="text-gray-400 ml-2 text-xs">— {ad.reason}</span>}
                                {ad.givenBy && <span className="text-gray-400 ml-2 text-xs">by {ad.givenBy.name}</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-green-600">− PKR {ad.discountAmount.toLocaleString()}</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteDiscount(ad._id); }}
                                  disabled={deletingDiscountId === ad._id}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Remove discount"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Referral Events */}
                    {detail.referralEvents.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-bold text-gray-900">Referral Info</h3>
                        </div>
                        <div className="space-y-2">
                          {detail.referralEvents.map((ev) => {
                            const hasRewardConfig = ev.referralCode?.rewardDiscountType && (ev.referralCode?.rewardDiscountValue || 0) > 0;
                            const rewardApplied = !!ev.rewardAppliedAt;
                            return (
                              <div key={ev._id} className="bg-white rounded-lg px-4 py-3 border border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">Code: {ev.code}</span>
                                    {ev.referrerUser && (
                                      <span className="text-gray-500 ml-2">
                                        Referrer: {ev.referrerUser.name} ({ev.referrerUser.email})
                                      </span>
                                    )}
                                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                                      ev.status === "qualified" ? "bg-green-100 text-green-700"
                                        : ev.status === "disqualified" ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                      {ev.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {rewardApplied && (
                                      <span className="text-xs text-green-600 font-medium">
                                        Reward: − PKR {ev.rewardDiscountAmount.toLocaleString()}
                                      </span>
                                    )}
                                    {!rewardApplied && hasRewardConfig && ev.referrerUser && (
                                      <button
                                        type="button"
                                        onClick={() => handleApplyReferralReward(ev._id, ev.referrerUser!.email)}
                                        disabled={submittingReferralReward === ev._id}
                                        className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg disabled:opacity-50 transition-colors"
                                      >
                                        {submittingReferralReward === ev._id ? "Applying..." : `Give Reward (${
                                          ev.referralCode!.rewardDiscountType === "percentage"
                                            ? `${ev.referralCode!.rewardDiscountValue}%`
                                            : `PKR ${ev.referralCode!.rewardDiscountValue}`
                                        })`}
                                      </button>
                                    )}
                                    {!rewardApplied && !hasRewardConfig && (
                                      <span className="text-xs text-gray-400">No reward configured</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {ev.eventType.replace(/_/g, " ")} · {new Date(ev.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Invoices */}
                    {detail.invoices.length > 0 ? (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Invoices</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-xs text-gray-500 border-b border-gray-200">
                                <th className="text-left py-2 pr-3">Invoice #</th>
                                <th className="text-left py-2 px-3">Date</th>
                                <th className="text-right py-2 px-3">Paid</th>
                                <th className="text-right py-2 px-3">Remaining</th>
                                <th className="text-center py-2 px-3">Status</th>
                                <th className="text-center py-2 pl-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detail.invoices.map((inv) => (
                                <tr key={inv._id} className="border-b border-gray-100">
                                  <td className="py-2.5 pr-3 font-mono text-xs">{inv.invoiceNumber}</td>
                                  <td className="py-2.5 px-3 text-xs text-gray-500">
                                    {new Date(inv.issuedAt).toLocaleDateString()}
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-green-700">{inv.paidAmount.toLocaleString()}</td>
                                  <td className="py-2.5 px-3 text-right font-semibold text-red-600">
                                    {detail.feeSummary.totalDue > 0 ? detail.feeSummary.totalDue.toLocaleString() : "0"}
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                      inv.status === "paid" ? "bg-green-100 text-green-700"
                                        : inv.status === "partially_paid" ? "bg-orange-100 text-orange-700"
                                        : inv.status === "overdue" ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}>
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pl-3 text-center">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setInvoiceDeleteTarget({ _id: inv._id, invoiceNumber: inv.invoiceNumber });
                                        setInvoiceDeleteStep("confirm");
                                        setInvoiceDeletePassword("");
                                      }}
                                      className="text-red-400 hover:text-red-600 transition-colors"
                                      title="Delete invoice"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-5 text-center">
                        <p className="text-sm text-gray-500">No invoices created yet</p>
                      </div>
                    )}

                    {/* Invoice Delete Confirmation Modal */}
                    {invoiceDeleteTarget && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => { setInvoiceDeleteTarget(null); setInvoiceDeleteStep("confirm"); setInvoiceDeletePassword(""); }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {invoiceDeleteStep === "confirm" ? (
                            <>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">Delete Invoice</h3>
                                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">
                                Are you sure you want to delete invoice <span className="font-mono font-semibold">{invoiceDeleteTarget.invoiceNumber}</span>?
                              </p>
                              <p className="text-xs text-red-600 mb-5">
                                All related ledger entries will be reversed and pending payments will be removed.
                              </p>
                              <div className="flex gap-3 justify-end">
                                <button
                                  type="button"
                                  onClick={() => { setInvoiceDeleteTarget(null); setInvoiceDeleteStep("confirm"); setInvoiceDeletePassword(""); }}
                                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setInvoiceDeleteStep("password")}
                                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Continue
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">Confirm with Password</h3>
                                  <p className="text-sm text-gray-500">Enter your admin password to confirm</p>
                                </div>
                              </div>
                              <input
                                type="password"
                                value={invoiceDeletePassword}
                                onChange={(e) => setInvoiceDeletePassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-5"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && invoiceDeletePassword.length >= 6 && !deletingInvoice) {
                                    handleDeleteInvoice();
                                  }
                                }}
                              />
                              <div className="flex gap-3 justify-end">
                                <button
                                  type="button"
                                  onClick={() => { setInvoiceDeleteStep("confirm"); setInvoiceDeletePassword(""); }}
                                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Back
                                </button>
                                <button
                                  type="button"
                                  onClick={handleDeleteInvoice}
                                  disabled={deletingInvoice || invoiceDeletePassword.length < 6}
                                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingInvoice ? "Deleting..." : "Delete Invoice"}
                                </button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </div>
                    )}

                    {/* Payments */}
                    {detail.payments.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-bold text-gray-900">Payment Records</h3>
                        </div>
                        <div className="space-y-2">
                          {detail.payments.map((p) => (
                            <div key={p._id} className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                              <div>
                                <span className="font-medium text-gray-900">PKR {p.amount.toLocaleString()}</span>
                                <span className="text-gray-500 ml-2">{p.paymentMethod.replace(/_/g, " ")}</span>
                                {p.transactionReference && (
                                  <span className="text-gray-400 ml-2 text-xs">Ref: {p.transactionReference}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">{new Date(p.submittedAt).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                  p.verificationStatus === "verified" ? "bg-green-100 text-green-700"
                                    : p.verificationStatus === "rejected" ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {p.verificationStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Installment Plans */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <h3 className="text-sm font-bold text-gray-900">Installment Plan</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setInstallmentFormOpen(!installmentFormOpen);
                            if (!installmentFormOpen) {
                              const remaining = detail.feeSummary.remainingFee;
                              setInstallmentRows([{ amount: String(remaining), dueDate: "" }]);
                            }
                          }}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800"
                        >
                          {installmentFormOpen ? "Cancel" : detail.installmentPlans.some((p) => p.status === "active") ? "Replace Plan" : "+ Create Plan"}
                        </button>
                      </div>

                      {/* Existing active plan */}
                      {detail.installmentPlans
                        .filter((p) => p.status === "active")
                        .map((plan) => (
                          <div key={plan._id} className="mb-4">
                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                              <span>Total: PKR {plan.totalAmount.toLocaleString()}</span>
                              <span>·</span>
                              <span>{plan.totalInstallments} installments</span>
                              {plan.createdBy && (
                                <>
                                  <span>·</span>
                                  <span>by {plan.createdBy.name}</span>
                                </>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              {plan.installments.map((inst) => (
                                <div
                                  key={inst._id}
                                  className="flex items-center justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-mono w-6">#{inst.installmentNumber}</span>
                                    <span className="font-medium text-gray-900">PKR {inst.amount.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500">Due: {new Date(inst.dueDate).toLocaleDateString()}</span>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                      inst.status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : inst.status === "overdue"
                                        ? "bg-red-100 text-red-700"
                                        : inst.status === "due"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {inst.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                      {!installmentFormOpen && !detail.installmentPlans.some((p) => p.status === "active") && (
                        <p className="text-sm text-gray-500 text-center py-2">No installment plan created</p>
                      )}

                      {/* Installment Plan Builder */}
                      {installmentFormOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 space-y-3"
                        >
                          <p className="text-xs text-gray-500">
                            Remaining fee: PKR {detail.feeSummary.remainingFee.toLocaleString()} · Split into installments with due dates
                          </p>
                          {installmentRows.map((row, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 w-6">#{idx + 1}</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="Amount"
                                value={row.amount}
                                onChange={(e) => {
                                  const updated = [...installmentRows];
                                  updated[idx] = { ...updated[idx], amount: e.target.value };
                                  setInstallmentRows(updated);
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <input
                                type="date"
                                value={row.dueDate}
                                onChange={(e) => {
                                  const updated = [...installmentRows];
                                  updated[idx] = { ...updated[idx], dueDate: e.target.value };
                                  setInstallmentRows(updated);
                                }}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              {installmentRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setInstallmentRows((rows) => rows.filter((_, i) => i !== idx))}
                                  className="p-1.5 text-red-400 hover:text-red-600 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setInstallmentRows((rows) => [...rows, { amount: "", dueDate: "" }])}
                                className="text-xs font-medium text-purple-600 hover:text-purple-800"
                              >
                                + Add Row
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const n = installmentRows.length;
                                  if (n < 1) return;
                                  const each = Math.floor(detail.feeSummary.remainingFee / n);
                                  const last = detail.feeSummary.remainingFee - each * (n - 1);
                                  setInstallmentRows((rows) =>
                                    rows.map((r, i) => ({ ...r, amount: String(i === n - 1 ? last : each) })),
                                  );
                                }}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700"
                              >
                                Split Equally
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Total: PKR{" "}
                              {installmentRows
                                .reduce((s, r) => s + (Number(r.amount) || 0), 0)
                                .toLocaleString()}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setInstallmentFormOpen(false)}
                              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCreateInstallmentPlan}
                              disabled={submittingInstallments}
                              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-colors"
                            >
                              {submittingInstallments ? "Creating..." : "Create Plan"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB: Status History ─── */}
                {detailTab === "history" && (
                  <div className="space-y-3">
                    {detail.history.length > 0 ? (
                      <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                        {detail.history.map((h) => (
                          <div key={h._id} className="relative">
                            <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(h.fromStatus)}`}>
                                  {statusOptions.find((s) => s.value === h.fromStatus)?.label || h.fromStatus}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(h.toStatus)}`}>
                                  {statusOptions.find((s) => s.value === h.toStatus)?.label || h.toStatus}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {new Date(h.createdAt).toLocaleString()}
                                {h.changedBy && <span>by {h.changedBy.name}</span>}
                              </div>
                              {h.statusNote && (
                                <p className="mt-1 text-xs text-gray-600 italic">{h.statusNote}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No status changes recorded</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </div>
  );
}
