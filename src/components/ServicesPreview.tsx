"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Brain, CloudCog, ArrowRight, CheckCircle2, Smartphone, Globe } from "lucide-react";

const ServicesPreview: React.FC = () => {
  // Mapping icons to string names from your data file
  const iconMap: any = {
    code: Code2,
    smartphone: Smartphone,
    globe: Globe,
    cloud: CloudCog,
    brain: Brain,
  };

  // Filhal hum top 3 services le rahe hain aapke logic ke mutabiq
  const cards = [
    {
      title: "Custom Tech Solutions",
      desc: "Bespoke platforms, internal systems, and business tools shaped around your exact workflow.",
      capabilities: ["Workflow mapping", "Admin dashboards", "API systems"],
      href: "/services/custom-tech-solutions",
      icon: Code2,
      accent: "sky" // Accent color theme for glows
    },
    {
      title: "Mobile App Development",
      desc: "Android and iOS apps engineered for real business workflows and reliable performance.",
      capabilities: ["Product design", "Native implementation", "Backend sync"],
      href: "/services/mobile-app-development",
      icon: Smartphone,
      accent: "blue"
    },
    {
      title: "AI & Machine Learning",
      desc: "Applied AI features, automation, and machine-learning workflows built into real products.",
      capabilities: ["Automation", "Document Intel", "ML Workflows"],
      href: "/services/ai-machine-learning-integration",
      icon: Brain,
      accent: "indigo"
    },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Glows (Subtle, minimalist match for hero section) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 border border-sky-100 mb-6">
            <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-700">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-[1000] text-slate-950 tracking-tighter mb-6">
            Technology <span className="text-sky-600 italic">Refined.</span>
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            Focused services engineered to drive measurable business impact and accelerate your roadmap.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-full"
              >
                {/* Floating Glow on Hover (Subtle, specific to accent color) */}
                <div className={`absolute -inset-1.5 bg-${c.accent}-500 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 transition duration-700`} />

                {/* Main Card Body: CLEAN WHITE BACKGROUND */}
                <div className="relative h-full bg-white border border-slate-200/80 rounded-[2.5rem] p-10 hover:border-sky-300 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-3 overflow-hidden">

                  {/* Top: Icon Box with Micro-Animations */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-300 group-hover:bg-sky-600 transition-colors duration-500">
                      <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">
                      0{i + 1}
                    </div>
                  </div>

                  {/* Content: High Visibility Typography */}
                  <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tight group-hover:text-sky-800 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                    {c.desc}
                  </p>

                  {/* Capabilities (Bullets) */}
                  <ul className="space-y-4 mb-10 flex-grow">
                    {c.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-3 text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                        <div className="h-5 w-5 rounded-full bg-sky-50 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        </div>
                        {cap}
                      </li>
                    ))}
                  </ul>

                  {/* Bottom: Action Link */}
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 font-black text-[13px] uppercase tracking-tighter text-slate-950 group-hover:text-sky-600 border-t border-slate-100 pt-6 transition-all"
                  >
                    View details
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;