"use client";

import React, { useEffect, useRef } from "react";

const TechPattern: React.FC<{ className?: string }> = ({ className = "" }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const blobs = Array.from(el.querySelectorAll<HTMLElement>(".tp-blob"));

    let raf = 0;
    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        blobs.forEach((b, i) => {
          const depth = (i + 1) / blobs.length; // 0..1
          const tx = -x * 40 * depth;
          const ty = -y * 30 * depth;
          const rot = x * 15 * depth;
          b.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
        });
      });
    }

    function onLeave() {
      blobs.forEach(
        (b) => (b.style.transform = "translate3d(0,0,0) rotate(0deg)"),
      );
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute left-10 top-16 w-72 h-72 rounded-full bg-linear-to-r from-primary-600 to-indigo-500 opacity-40 blur-3xl tp-blob" />
      <div className="absolute right-8 top-24 w-56 h-56 rounded-full bg-linear-to-r from-purple-600 to-primary-500 opacity-30 blur-2xl tp-blob" />
      <div className="absolute left-1/3 bottom-20 w-96 h-96 rounded-full bg-linear-to-r from-primary-700 to-primary-400 opacity-18 blur-4xl tp-blob" />
      <div className="absolute right-1/4 bottom-8 w-44 h-44 rounded-full bg-linear-to-r from-indigo-600 to-primary-600 opacity-28 blur-2xl tp-blob" />
      <svg
        className="absolute inset-0 w-full h-full mix-blend-overlay opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M80 0 L0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="cgrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* subtle circuitry lines */}
        <g className="opacity-40">
          <path
            d="M20,40 L120,40 L160,80 L260,80"
            stroke="url(#cgrad)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="120" cy="40" r="3" fill="rgba(255,255,255,0.06)" />
          <path
            d="M360,60 L460,60 L520,20 L620,20"
            stroke="url(#cgrad)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="460" cy="60" r="3" fill="rgba(255,255,255,0.06)" />
        </g>
      </svg>
    </div>
  );
};

export default TechPattern;
