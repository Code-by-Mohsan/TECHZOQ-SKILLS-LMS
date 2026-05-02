"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturesSection() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    setVersion(`?v=${Date.now()}`);
  }, []);

  return (
    <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden bg-white pt-32 pb-20">

      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex justify-end">
        {version && (
          <Image
            src={`/images/portfolio/what-hero-section.png${version}`}
            alt="Background Hero"
            fill
            priority
            unoptimized
            className="object-contain object-right opacity-100 lg:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-0" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Left-aligned Content Container */}
        <div className="flex flex-col items-start text-left max-w-4xl relative z-20">

          {/* 1. Refined Badge - Perfectly Aligned Left */}
          <div className="relative inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-950 mb-10 shadow-2xl shadow-slate-200 group transition-all hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white pr-1">
              Future-Ready Solutions
            </span>
          </div>

          {/* 2. High-Impact Heading - Bold Typography */}
          <div className="space-y-8">
            <h1 className="text-6xl font-[1000] leading-[0.95] text-slate-950 md:text-8xl tracking-[-0.05em]">
              Technology <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent italic">refined</span>
                <span className="absolute -bottom-2 left-0 h-3 w-full bg-sky-100/60 rounded-full -z-10"></span>
              </span>
              <br />
              for growth.
            </h1>

            {/* 3. Refined Description */}
            <p className="text-xl leading-relaxed text-slate-600 md:text-2xl font-medium max-w-2xl border-l-8 border-sky-500 pl-8 py-2">
              TECHZOQ delivers product engineering, UX, cloud, and custom systems with a <span className="text-slate-950 font-black">practical professional focus</span>.
            </p>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex flex-wrap gap-6 mt-12">
            <Link href="/contact" className="group relative overflow-hidden rounded-2xl bg-slate-950 px-12 py-5 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Discuss Your Project <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <Link href="/get-quote" className="rounded-2xl border-2 border-slate-200 bg-white px-12 py-5 font-bold text-slate-950 hover:border-sky-500 hover:text-sky-600 transition-all">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}