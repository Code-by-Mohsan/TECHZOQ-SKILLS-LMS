"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Cpu, Cloud, Workflow } from "lucide-react";
import { useRef } from "react";

// --- DATA CONFIGURATION ---
const featureCards = [
  {
    icon: Sparkles,
    title: "AI Solutions",
    desc: "Smart automation & ML models",
    color: "text-blue-400",
  },
  {
    icon: Code,
    title: "Development",
    desc: "Full-stack custom builds",
    color: "text-cyan-400",
  },
  {
    icon: Workflow,
    title: "Automation",
    desc: "Workflow & process optimization",
    color: "text-violet-400",
  },
  {
    icon: Cloud,
    title: "Cloud Infra",
    desc: "Scalable & secure hosting",
    color: "text-emerald-500",
  },
];

const stats = [
  { label: "Projects Delivered", value: "200+" },
  { label: "Happy Clients", value: "150+" },
  { label: "Team Members", value: "50+" },
  { label: "Countries Served", value: "25+" },
];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* --- SECTION 1: BACKGROUND LAYER (Video & Grids) --- */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src="/images/portfolio/vedio2.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/40 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] z-[2]" />

      <motion.div
        style={{ y }}
        className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] z-[3]"
      />


      {/* --- SECTION 2: MAIN CONTENT CONTAINER --- */}
      <motion.div
        style={{ opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-32 pb-16"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT COLUMN: BRANDING & HEADLINE */}
          <div className="flex-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-10 h-px bg-blue-500" />
              <span className="text-blue-400 text-xs font-normal uppercase tracking-[2.5px]">
                Technology Company
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1] mb-8"
            >
              <span className="text-white block">We Build</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Digital Futures
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-slate-300 leading-7 mb-10 max-w-md drop-shadow-md"
            >
              AI-powered solutions, scalable cloud infrastructure, and exceptional digital experiences — crafted to transform how your business operates.
            </motion.p>

            {/* CALL TO ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/get-quote">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 via-green-500/90 to-sky-600 text-white font-medium py-3.5 px-7 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-sm">Get a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link href="/courses">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white font-medium py-3.5 px-7 rounded-xl hover:bg-white/20 transition-all duration-300">
                  <span className="text-sm">Explore Courses</span>
                </div>
              </Link>
            </motion.div>
          </div>
          

          {/* RIGHT COLUMN: FEATURE CARDS GRID */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="grid grid-cols-2 gap-3.5">
              {featureCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:border-cyan-400/50 transition-all duration-300 group"
                >
                  <card.icon className={`w-5 h-5 ${card.color} mb-6`} strokeWidth={1.67} />
                  <div className="text-sm font-normal text-white mb-1.5">
                    {card.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {card.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- SECTION 3: STATS BAR --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 lg:mt-20 max-w-4xl mx-auto"
        >
          <div className="flex rounded-xl border border-white/10 overflow-hidden backdrop-blur-md">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex-1 bg-black/30 py-7 px-6 text-center ${i < stats.length - 1 ? "border-r border-white/10" : ""
                  }`}
              >
                <div className="text-3xl font-normal text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>


      {/* --- SECTION 4: FOOTER DECORATION --- */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}