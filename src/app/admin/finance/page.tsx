"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaymentItem {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  verificationStatus: string;
  createdAt: string;
  student?: { user?: { name?: string; email?: string } };
  invoice?: { invoiceNumber?: string };
}

export default function AdminFinancePage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/finance/payments");
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Failed to load payments");
        return;
      }
      setPayments(json.data || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const reviewPayment = async (paymentId: string, status: "verified" | "rejected") => {
    const rejectionReason =
      status === "rejected" ? window.prompt("Enter rejection reason") || "" : "";
    const res = await fetch("/api/admin/finance/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId,
        review: {
          verificationStatus: status,
          rejectionReason,
        },
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message || "Failed to update payment");
      return;
    }
    toast.success(`Payment ${status}`);
    fetchPayments();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finance Review Queue</h1>
        <p className="text-sm text-gray-500 mt-1">Verify or reject submitted payment proofs</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading payments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {payment.student?.user?.name || "—"}
                      <div className="text-xs text-gray-500">{payment.student?.user?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {payment.invoice?.invoiceNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">PKR {payment.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{payment.paymentMethod}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{payment.verificationStatus}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => reviewPayment(payment._id, "verified")}
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => reviewPayment(payment._id, "rejected")}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

