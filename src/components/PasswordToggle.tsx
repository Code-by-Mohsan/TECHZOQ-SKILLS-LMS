"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordToggle: React.FC<{
  value: string;
  onChange: (v: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      className={`${className} p-1 rounded-md text-gray-600 hover:text-gray-800`}
      aria-label={visible ? "Hide password" : "Show password"}
      onMouseDown={(e) => e.preventDefault()}
    >
      {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );
};

export default PasswordToggle;
