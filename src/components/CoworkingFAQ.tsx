"use client";

import React, { useState } from "react";

const QA: { q: string; a: string }[] = [
  {
    q: "Do you offer day passes?",
    a: "Yes — we have flexible day passes available which include workspace access and Wi‑Fi.",
  },
  {
    q: "Can I book meeting rooms?",
    a: "Meeting rooms are bookable by the hour and can be reserved online or at the front desk.",
  },
  {
    q: "Is there 24/7 access?",
    a: "Certain plans (dedicated desks and private offices) include 24/7 access. Day passes are limited to business hours.",
  },
  {
    q: "Do you host community events?",
    a: "Yes — we run weekly workshops, office hours, and networking events. Members get priority invites.",
  },
];

export default function CoworkingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {QA.map((item, idx) => (
        <div key={idx} className="border rounded-lg">
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full px-4 py-3 text-left flex items-center justify-between"
          >
            <span className="font-medium">{item.q}</span>
            <span className="text-sm text-gray-500">
              {open === idx ? "−" : "+"}
            </span>
          </button>
          {open === idx && (
            <div className="px-4 pb-4 text-sm text-gray-700">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
