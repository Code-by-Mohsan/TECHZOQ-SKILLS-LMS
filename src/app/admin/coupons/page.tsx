"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface CouponItem {
  _id: string;
  code: string;
  title: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export default function AdminCouponsPage() {
  const [items, setItems] = useState<CouponItem[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    title: "",
    discountType: "percentage",
    discountValue: 10,
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load coupons");
      setItems(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load coupons");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCoupon = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create coupon");
      setForm({ code: "", title: "", discountType: "percentage", discountValue: 10 });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create coupon");
    }
  };

  const toggleCoupon = async (item: CouponItem) => {
    try {
      setError("");
      const res = await fetch(`/api/admin/coupons/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update coupon");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update coupon");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coupon Engine</h1>
        <p className="text-sm text-gray-500 mt-1">Create and manage discount codes.</p>
      </div>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <form onSubmit={createCoupon} className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={form.code}
          onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
          placeholder="Code"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <select
          value={form.discountType}
          onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
        <input
          type="number"
          value={form.discountValue}
          onChange={(e) => setForm((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium w-fit">
          Add Coupon
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No coupons created.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.code} · {item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.discountType} {item.discountValue} · used {item.usedCount}/{item.usageLimit || "∞"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleCoupon(item)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${item.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
