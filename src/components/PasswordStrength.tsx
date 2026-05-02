"use client";

import React from "react";

function scorePassword(pw: string) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length >= 12) score += 1;
  return score; // 0..5
}

const labels = ["Very Weak", "Weak", "Okay", "Good", "Strong", "Excellent"];

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const s = scorePassword(password);
  const pct = Math.round((s / 5) * 100);
  const color =
    s <= 1
      ? "bg-red-500"
      : s === 2
        ? "bg-yellow-400"
        : s === 3
          ? "bg-amber-500"
          : s === 4
            ? "bg-green-500"
            : "bg-teal-500";

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`${color} h-2`}
          style={{ width: `${pct}%`, transition: "width 180ms ease" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{labels[s]}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
};

export default PasswordStrength;
