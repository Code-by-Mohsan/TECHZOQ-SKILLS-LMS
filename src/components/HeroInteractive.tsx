"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function HeroInteractive() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      if (!el) return; // <-- Fix
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPos({ x, y });
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener(
      "touchmove",
      (ev: TouchEvent) => {
        const t = ev.touches[0];
        if (!t) return;
        const rect = el.getBoundingClientRect();
        setPos({
          x: (t.clientX - rect.left) / rect.width,
          y: (t.clientY - rect.top) / rect.height,
        });
      },
      { passive: true },
    );

    return () => {
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

  // blobs positions respond to mouse
  const blob1 = {
    transform: `translate3d(${(pos.x - 0.5) * 40}px, ${(pos.y - 0.5) * 20}px, 0) scale(1.1)`,
  };
  const blob2 = {
    transform: `translate3d(${(pos.x - 0.5) * -30}px, ${(pos.y - 0.5) * -18}px, 0) scale(1)`,
  };
  const blob3 = {
    transform: `translate3d(${(pos.x - 0.5) * 20}px, ${(pos.y - 0.5) * -10}px, 0) scale(1.05)`,
  };

  return (
    <div ref={ref} className="absolute inset-0 -z-10 pointer-events-none">
      <motion.div
        style={blob1}
        className="absolute right-20 top-16 w-72 h-72 rounded-full bg-gradient-to-br from-primary-400/30 to-primary-500/10 blur-3xl"
      />
      <motion.div
        style={blob2}
        className="absolute left-10 top-28 w-56 h-56 rounded-full bg-gradient-to-br from-indigo-300/30 to-indigo-400/8 blur-3xl"
      />
      <motion.div
        style={blob3}
        className="absolute left-1/2 bottom-8 w-80 h-36 rounded-full bg-gradient-to-r from-emerald-300/20 to-emerald-400/6 blur-3xl -translate-x-1/2"
      />

      {/* Hoverable feature chips (pointer events enabled) */}
      <div className="absolute left-8 top-8 z-0 pointer-events-auto">
        <FeatureChip title="AI Consulting" subtitle="Prototype to production" />
      </div>

      <div className="absolute right-8 bottom-20 z-0 pointer-events-auto">
        <FeatureChip title="Cloud & DevOps" subtitle="Secure, scalable infra" />
      </div>

      <div className="absolute left-1/2 top-40 -translate-x-1/2 z-0 pointer-events-auto">
        <FeatureChip title="Custom Apps" subtitle="Web, mobile & APIs" />
      </div>
    </div>
  );
}

function FeatureChip({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-2 shadow-md w-44"
    >
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </motion.div>
  );
}
