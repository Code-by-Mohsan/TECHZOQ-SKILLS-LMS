"use client";

import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Cloud,
  Cpu,
  ExternalLink,
  Globe,
  Leaf,
  Quote,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";

const domainExpertise = [
  "FinTech Systems",
  "SaaS Platforms",
  "ERP Solutions",
  "AI-based Applications",
  "Cloud Infrastructure & DevOps",
];

const professionalJourney = [
  {
    title: "Financial platforms and digital systems",
    description:
      "Built and contributed to technology systems where reliability, security, and scalability directly impact operations.",
    icon: TrendingUp,
  },
  {
    title: "Enterprise SaaS and ERP architecture",
    description:
      "Worked on business platforms, operational systems, and automation-focused applications designed for real organizational use.",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI-integrated and data-driven products",
    description:
      "Applied modern engineering and product thinking to solutions that combine automation, intelligence, and practical execution.",
    icon: Cpu,
  },
];

const differencePoints = [
  "Real development environment, not theoretical setups",
  "Exposure to production-level systems",
  "Industry-experienced leadership and mentorship",
  "Focus on building, not just learning",
  "Integration of modern technologies including AI",
];

export default function FounderPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Manzoor Ahmad",
    jobTitle: "Founder & CEO",
    url: "https://techzoq.com/founder",
    sameAs: ["https://www.linkedin.com/in/manzoorjoyia/"],
    worksFor: {
      "@type": "Organization",
      name: "TECHZOQ",
      url: "https://techzoq.com",
    },
    knowsAbout: [
      "Software Architecture",
      "FinTech Systems",
      "SaaS Platforms",
      "ERP Solutions",
      "AI-based Applications",
      "Cloud Infrastructure",
      "DevOps",
      "Technology Education",
      "Agriculture Technology",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kasur",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900">
      <Script
        id="founder-person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Header />

      <main id="main" className="pt-24">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm"
              >
                <BadgeCheck className="h-4 w-4" />
                Founder & CEO — TECHZOQ
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mt-6 text-4xl font-black leading-tight text-slate-950 md:text-6xl"
              >
                Founder & CEO — TECHZOQ
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-6 text-xl leading-relaxed text-slate-600"
              >
                Building technology, empowering people, and shaping the future
                of Pakistan.
              </motion.p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
                  8+ Years of Industry Experience
                </span>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
                  Software Architect
                </span>
                <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-800">
                  Vision-Driven Entrepreneur
                </span>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Explore TECHZOQ
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/manzoorjoyia/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 hover:bg-slate-50"
                >
                  LinkedIn Profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
                    Leadership Snapshot
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    Manzoor Ahmad
                  </h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-400 text-xl font-black text-white shadow-lg">
                  MA
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Role
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Founder & CEO
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Base
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Kasur, Punjab
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Core Strength
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Architecture + Product Thinking
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Direction
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Systems, People, Ecosystems
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-sky-100 bg-sky-50 p-6">
                <Quote className="h-6 w-6 text-sky-700" />
                <p className="mt-3 text-lg leading-relaxed text-slate-700">
                  Technology should not remain limited to big cities. It should
                  reach places where it can truly transform lives.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
                About the Founder
              </p>
              <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                Engineering depth with execution ability
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Manzoor Ahmad is the Founder & CEO of TECHZOQ, a technology
                company focused on building real-world software systems and
                developing high-impact tech talent. With over 8+ years of
                experience in the tech industry, he brings a combination of
                engineering depth, product thinking, and execution ability.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {domainExpertise.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-center shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
                Professional Journey
              </p>
              <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                Built on solving real-world problems through technology
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                From early development work to leading complex system
                architectures, his experience extends beyond development into
                system design, DevOps, scalability, and product strategy.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {professionalJourney.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-3 text-sky-700">
                  <Building2 className="h-5 w-5" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em]">
                    The Purpose Behind TECHZOQ
                  </p>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
                  Bringing a real technology environment where opportunity is limited
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  TECHZOQ was founded with a clear purpose: to bring a real
                  technology environment to regions where opportunities are
                  limited but potential is high. Kasur, like many cities in
                  Pakistan, has talented individuals but lacks practical
                  learning environments, industry exposure, and modern
                  development practices.
                </p>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  TECHZOQ bridges this gap by creating a real-world,
                  production-level tech ecosystem, not just a traditional
                  learning space.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Practical learning environments",
                  "Industry exposure",
                  "Modern development practices",
                  "Production-level ecosystem thinking",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="font-semibold text-slate-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-700">
                  <Leaf className="h-5 w-5" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em]">
                    Vision
                  </p>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
                  Create impact in the agriculture ecosystem of Pakistan
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  The long-term vision of TECHZOQ goes beyond education. It is
                  about building technology platforms for farmers and
                  agri-markets, digitizing traditional systems, enabling
                  data-driven agriculture, and connecting local ecosystems with
                  modern tech solutions.
                </p>
                <div className="mt-8 grid gap-3">
                  {[
                    "Building technology platforms for farmers and agri-markets",
                    "Digitizing traditional systems",
                    "Enabling data-driven agriculture",
                    "Connecting local ecosystems with modern tech solutions",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-emerald-100 bg-white p-4 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-sky-700">
                  <Target className="h-5 w-5" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em]">
                    Mission
                  </p>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
                  Develop people of Kasur with advanced AI-based skills
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  TECHZOQ is focused on training individuals in modern
                  technologies including AI, web, and cloud, developing
                  problem-solving and engineering thinking, and making people of
                  Kasur globally competitive through skills, not degrees.
                </p>
                <div className="mt-8 grid gap-3">
                  {[
                    "Modern technologies including AI, web, and cloud",
                    "Problem-solving and engineering thinking",
                    "Global-level professional readiness",
                    "Earning opportunities through skills",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-sky-100 bg-white p-4 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em]">
                    What Makes TECHZOQ Different
                  </p>
                </div>
                <div className="mt-8 grid gap-4">
                  {differencePoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="font-semibold text-slate-900">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-sky-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                <div className="flex items-center gap-3 text-emerald-200">
                  <Globe className="h-5 w-5" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em]">
                    Leadership Philosophy
                  </p>
                </div>
                <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                  Building systems, people, and ecosystems together
                </h2>
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                  <Quote className="h-6 w-6 text-emerald-200" />
                  <p className="mt-3 text-lg leading-relaxed text-slate-100">
                    Technology should not remain limited to big cities. It
                    should reach places where it can truly transform lives.
                  </p>
                </div>
                <p className="mt-6 text-lg leading-relaxed text-slate-200">
                  Manzoor Ahmad believes in practical learning, real execution,
                  and long-term impact over short-term results. His leadership
                  is focused on building systems, people, and ecosystems
                  together.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="https://www.linkedin.com/in/manzoorjoyia/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Manzoor Ahmad on LinkedIn
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/apply"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white hover:bg-white/14"
                  >
                    Apply to TECHZOQ
                    <Rocket className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
