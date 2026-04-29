"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DollarSign,
  CreditCard,
  Tag,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Receipt,
  Smartphone,
  Download,
  FileText,
  Plus,
  Loader2,
} from "lucide-react";

/* ── Types ────────────────────────────────────────── */

interface CouponDiscount {
  code: string;
  discountAmount: number;
  status: string;
}
interface AdminDiscountItem {
  reason: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}
interface DiscountInfo {
  coupons: CouponDiscount[];
  adminDiscounts: AdminDiscountItem[];
  totalDiscount: number;
}
interface Installment {
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
}
interface InstallmentPlanInfo {
  _id: string;
  totalAmount: number;
  totalInstallments: number;
  status: string;
  installments: Installment[];
}
interface InvoiceItem {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  issuedAt: string;
  dueDate: string | null;
}
interface Breakdown {
  applicationId: string;
  status: string;
  courseName: string;
  courseSlug: string;
  courseFee: number;
  enrollmentFee: number;
  discounts: DiscountInfo;
  netFee: number;
  totalPaid: number;
  totalDue: number;
  invoices: InvoiceItem[];
  installmentPlan: InstallmentPlanInfo | null;
}
interface PaymentHistoryItem {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  verificationStatus: string;
  invoiceNumber: string | null;
  createdAt: string;
}

/* ── Helpers ──────────────────────────────────────── */

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString("en-PK")}`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    issued: "bg-blue-100 text-blue-700",
    partially_paid: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-600",
    cancelled: "bg-gray-100 text-gray-500",
    upcoming: "bg-gray-100 text-gray-600",
    due: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function paymentStatusIcon(status: string) {
  if (status === "approved" || status === "verified")
    return <CheckCircle2 size={14} className="text-green-500" />;
  if (status === "rejected")
    return <XCircle size={14} className="text-red-500" />;
  return <Clock size={14} className="text-amber-500" />;
}

/* ── Page ─────────────────────────────────────────── */

export default function StudentFinancePage() {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // Payment form state
  const [payFormOpen, setPayFormOpen] = useState<string | null>(null); // invoiceId
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("bank_transfer");
  const [payReference, setPayReference] = useState("");
  const [submittingPay, setSubmittingPay] = useState(false);

  // Invoice generation state
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/student/finance/breakdown");
      const json = await res.json();
      if (json.success) {
        setBreakdowns(json.data.breakdowns || []);
        setPaymentHistory(json.data.paymentHistory || []);
      } else {
        toast.error(json.message || "Failed to load finance data");
      }
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitPayment = async (invoiceId: string) => {
    const amount = Number(payAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!payReference.trim()) {
      toast.error("Enter transaction reference");
      return;
    }
    setSubmittingPay(true);
    try {
      const res = await fetch("/api/student/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          amount,
          paymentMethod: payMethod,
          transactionReference: payReference.trim(),
          providerType: "manual",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Payment submission failed");
        return;
      }
      toast.success("Payment submitted for review");
      setPayFormOpen(null);
      setPayAmount("");
      setPayMethod("bank_transfer");
      setPayReference("");
      fetchData();
    } catch {
      toast.error("Payment submission failed");
    } finally {
      setSubmittingPay(false);
    }
  };

  const handleGenerateInvoice = async (
    applicationId: string,
    type: "enrollment" | "remaining" | "installment",
    installmentNumber?: number,
  ) => {
    const key = `${applicationId}-${type}-${installmentNumber || ""}`;
    setGeneratingInvoice(key);
    try {
      const body: Record<string, unknown> = { applicationId, type };
      if (installmentNumber) body.installmentNumber = installmentNumber;
      const res = await fetch("/api/student/finance/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to generate invoice");
        return;
      }
      toast.success(`Invoice ${json.data.invoiceNumber} generated`);
      fetchData();
    } catch {
      toast.error("Failed to generate invoice");
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const handleDownloadPdf = async (invoiceId: string, invoiceNumber: string) => {
    setDownloadingPdf(invoiceId);
    try {
      const res = await fetch(`/api/student/finance/invoice-pdf/${invoiceId}`);
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        toast.error(json?.message || "Failed to download PDF");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
          Loading finance data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fee breakdown, invoices &amp; payment history
        </p>
      </div>

      {/* Account Details Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Smartphone size={20} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Payment Account Details
            </h3>
            <div className="mt-1 text-sm text-blue-800 space-y-0.5">
              <p>
                <span className="font-medium">Account:</span> 03029517405
              </p>
              <p>
                <span className="font-medium">Name:</span> Mohsan Ali
              </p>
              <p>
                <span className="font-medium">Method:</span> JazzCash /
                EasyPaisa / Bank Transfer
              </p>
            </div>
            <p className="mt-2 text-xs text-blue-600">
              After sending payment, submit proof below against the relevant
              invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Fee Breakdowns per Application */}
      {breakdowns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
          <Receipt size={32} className="mx-auto mb-2 text-gray-300" />
          No fee records found.
        </div>
      ) : (
        breakdowns.map((bd) => {
          const isExpanded = expandedApp === bd.applicationId;
          const paidPercent =
            bd.netFee > 0
              ? Math.min(100, Math.round((bd.totalPaid / bd.netFee) * 100))
              : bd.totalPaid > 0
                ? 100
                : 0;

          return (
            <div
              key={bd.applicationId}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Course Header */}
              <button
                type="button"
                onClick={() =>
                  setExpandedApp(isExpanded ? null : bd.applicationId)
                }
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <BookOpen size={18} className="text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {bd.courseName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Status: {bd.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPKR(bd.totalDue)}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        due
                      </span>
                    </p>
                    <div className="w-28 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${paidPercent}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-5">
                  {/* Fee Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[11px] text-gray-500 uppercase font-medium">
                        Course Fee
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-0.5">
                        {formatPKR(bd.courseFee)}
                      </p>
                    </div>
                    {bd.enrollmentFee > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] text-gray-500 uppercase font-medium">
                          Enrollment Fee
                        </p>
                        <p className="text-base font-bold text-gray-900 mt-0.5">
                          {formatPKR(bd.enrollmentFee)}
                        </p>
                      </div>
                    )}
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-[11px] text-green-600 uppercase font-medium">
                        Total Paid
                      </p>
                      <p className="text-base font-bold text-green-700 mt-0.5">
                        {formatPKR(bd.totalPaid)}
                      </p>
                    </div>
                    <div
                      className={`rounded-lg p-3 ${bd.totalDue > 0 ? "bg-red-50" : "bg-green-50"}`}
                    >
                      <p
                        className={`text-[11px] uppercase font-medium ${bd.totalDue > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        Remaining
                      </p>
                      <p
                        className={`text-base font-bold mt-0.5 ${bd.totalDue > 0 ? "text-red-700" : "text-green-700"}`}
                      >
                        {formatPKR(bd.totalDue)}
                      </p>
                    </div>
                  </div>

                  {/* Discounts */}
                  {bd.discounts.totalDiscount > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Tag size={13} /> Discounts Applied
                      </h4>
                      <div className="space-y-1.5">
                        {bd.discounts.coupons.map((c) => (
                          <div
                            key={c.code}
                            className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2 text-xs"
                          >
                            <span className="text-purple-700 font-medium">
                              Coupon: {c.code}
                            </span>
                            <span className="text-purple-800 font-bold">
                              -{formatPKR(c.discountAmount)}
                            </span>
                          </div>
                        ))}
                        {bd.discounts.adminDiscounts.map((d, i) => (
                          <div
                            key={`admin-${i}`}
                            className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2 text-xs"
                          >
                            <span className="text-amber-700 font-medium">
                              Admin Discount: {d.reason}
                              <span className="text-amber-500 ml-1">
                                ({d.discountType === "percentage" ? `${d.discountValue}%` : `flat ${formatPKR(d.discountValue)}`})
                              </span>
                            </span>
                            <span className="text-amber-800 font-bold">
                              -{formatPKR(d.discountAmount)}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between px-3 py-1 text-xs text-gray-600 border-t border-gray-200">
                          <span className="font-medium">Net Fee After Discounts</span>
                          <span className="font-bold text-gray-900">
                            {formatPKR(bd.netFee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Invoice Actions */}
                  {bd.totalDue > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <FileText size={13} /> Generate Invoice
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {bd.enrollmentFee > 0 && (
                          <button
                            type="button"
                            disabled={generatingInvoice !== null}
                            onClick={() =>
                              handleGenerateInvoice(bd.applicationId, "enrollment")
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium disabled:opacity-50 transition-colors"
                          >
                            {generatingInvoice === `${bd.applicationId}-enrollment-` ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Plus size={12} />
                            )}
                            Enrollment Fee Invoice
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={generatingInvoice !== null}
                          onClick={() =>
                            handleGenerateInvoice(bd.applicationId, "remaining")
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium disabled:opacity-50 transition-colors"
                        >
                          {generatingInvoice === `${bd.applicationId}-remaining-` ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Plus size={12} />
                          )}
                          Remaining Fee Invoice
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Installment Plan */}
                  {bd.installmentPlan && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Calendar size={13} /> Installment Plan
                        <span className="text-[10px] text-gray-400 font-normal ml-1">
                          ({bd.installmentPlan.totalInstallments} installments)
                        </span>
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                #
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Amount
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Due Date
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Paid
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Status
                              </th>
                              <th className="text-right px-3 py-2 font-semibold text-gray-500">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {bd.installmentPlan.installments.map((inst) => (
                              <tr
                                key={inst.installmentNumber}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-3 py-2 text-gray-900">
                                  {inst.installmentNumber}
                                </td>
                                <td className="px-3 py-2 font-medium text-gray-900">
                                  {formatPKR(inst.amount)}
                                </td>
                                <td className="px-3 py-2 text-gray-600">
                                  {new Date(inst.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2 text-gray-900">
                                  {formatPKR(inst.paidAmount)}
                                </td>
                                <td className="px-3 py-2">
                                  {statusBadge(inst.status)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {inst.status !== "paid" && (
                                    <button
                                      type="button"
                                      disabled={generatingInvoice !== null}
                                      onClick={() =>
                                        handleGenerateInvoice(
                                          bd.applicationId,
                                          "installment",
                                          inst.installmentNumber,
                                        )
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-medium disabled:opacity-50 transition-colors"
                                    >
                                      {generatingInvoice ===
                                      `${bd.applicationId}-installment-${inst.installmentNumber}` ? (
                                        <Loader2 size={10} className="animate-spin" />
                                      ) : (
                                        <FileText size={10} />
                                      )}
                                      Invoice
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Invoices */}
                  {bd.invoices.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Receipt size={13} /> Invoices
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Invoice #
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Total
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Paid
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Due
                              </th>
                              <th className="text-left px-3 py-2 font-semibold text-gray-500">
                                Status
                              </th>
                              <th className="text-right px-3 py-2 font-semibold text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {bd.invoices.map((inv) => (
                              <tr
                                key={inv._id}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-3 py-2 font-medium text-gray-900">
                                  {inv.invoiceNumber}
                                </td>
                                <td className="px-3 py-2 text-gray-900">
                                  {formatPKR(inv.totalAmount)}
                                </td>
                                <td className="px-3 py-2 text-gray-900">
                                  {formatPKR(inv.paidAmount)}
                                </td>
                                <td className="px-3 py-2 text-gray-900">
                                  {formatPKR(inv.dueAmount)}
                                </td>
                                <td className="px-3 py-2">
                                  {statusBadge(inv.status)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      disabled={downloadingPdf === inv._id}
                                      onClick={() =>
                                        handleDownloadPdf(inv._id, inv.invoiceNumber)
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-medium disabled:opacity-50 transition-colors"
                                      title="Download PDF"
                                    >
                                      {downloadingPdf === inv._id ? (
                                        <Loader2 size={10} className="animate-spin" />
                                      ) : (
                                        <Download size={10} />
                                      )}
                                      PDF
                                    </button>
                                    {inv.dueAmount > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPayFormOpen(
                                            payFormOpen === inv._id
                                              ? null
                                              : inv._id,
                                          );
                                          setPayAmount("");
                                          setPayReference("");
                                          setPayMethod("bank_transfer");
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors"
                                      >
                                        <CreditCard size={11} />
                                        Pay
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Payment Form */}
                      {bd.invoices.some((inv) => inv._id === payFormOpen) && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="text-xs font-semibold text-blue-900 mb-3 flex items-center gap-1.5">
                            <Send size={12} /> Submit Payment for{" "}
                            {bd.invoices.find((i) => i._id === payFormOpen)
                              ?.invoiceNumber}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Amount (PKR)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                                placeholder="e.g. 5000"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Payment Method
                              </label>
                              <select
                                value={payMethod}
                                onChange={(e) => setPayMethod(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                              >
                                <option value="bank_transfer">
                                  Bank Transfer
                                </option>
                                <option value="jazzcash_manual">
                                  JazzCash
                                </option>
                                <option value="easypaisa_manual">
                                  EasyPaisa
                                </option>
                                <option value="cash">Cash</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                                Transaction Reference
                              </label>
                              <input
                                type="text"
                                value={payReference}
                                onChange={(e) =>
                                  setPayReference(e.target.value)
                                }
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                                placeholder="TXN ID or receipt #"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              type="button"
                              disabled={submittingPay}
                              onClick={() =>
                                handleSubmitPayment(payFormOpen as string)
                              }
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors"
                            >
                              {submittingPay
                                ? "Submitting..."
                                : "Submit Payment"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPayFormOpen(null)}
                              className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Payment History */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <DollarSign size={14} /> Payment History
          </h2>
        </div>
        {paymentHistory.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            No payments submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Reference
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Invoice
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentHistory.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {formatPKR(p.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {p.paymentMethod.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 font-mono">
                      {p.transactionReference || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {p.invoiceNumber || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        {paymentStatusIcon(p.verificationStatus)}
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

