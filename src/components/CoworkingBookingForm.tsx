"use client";

import React, { useState } from "react";

export default function CoworkingBookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    type: "day",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "coworking",
          name: form.name,
          email: form.email,
          company: form.company,
          preferredDate: form.date,
          passType: form.type,
        }),
      });

      if (resp.ok) {
        alert("Thanks — we received your request. We will follow up soon.");
        setForm({ name: "", email: "", company: "", date: "", type: "day" });
      } else {
        alert("Failed to submit — please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          placeholder="Company (optional)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium mr-3">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-md border px-3 py-2"
        >
          <option value="day">Day Pass</option>
          <option value="desk">Dedicated Desk</option>
          <option value="office">Private Office</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-600 text-white px-4 py-2"
        >
          {loading ? "Sending..." : "Request Visit"}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm({
              name: "",
              email: "",
              company: "",
              date: "",
              type: "day",
            });
          }}
          className="rounded-md border px-4 py-2"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
