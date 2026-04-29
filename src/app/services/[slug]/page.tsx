"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";
import React, { use } from "react";
import Header from "@/components/Header";
import ServiceIcon from "@/components/services/ServiceIcon";
import MobileTechStack from "@/components/MobileTechStack";
import BestFit from "@/components/services/BestFit";
import CapabilitiesSection from "@/components/services/CapabilitiesSection";
import {
  SiNextdotjs, SiReact, SiTypescript, SiNodedotjs,
  SiPython, SiPostgresql, SiMongodb, SiTailwindcss,
  SiDocker, SiGraphql, SiRedux
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import {
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/content/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ServiceDetailPage({ params }: PageProps) {
  const decodedParams = use(params);
  const slug = decodedParams.slug;

  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedServices = getRelatedServices(slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seoDescription,
    url: `https://techzoq.com${service.path}`,
    provider: {
      "@type": "Organization",
      name: "TECHZOQ",
      url: "https://techzoq.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    serviceType: service.title,
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Script
        id={`service-schema-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main id="main" className="relative">
        <div className="absolute inset-0 z-0 h-[100vh] border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]" />

        <section className="relative z-10 pt-24">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="">
                <div className="space-y-6 max-w-xl">
                  {/* Eyebrow and Title Group */}
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
                      {service.eyebrow}
                    </p>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mt-4 text-4xl font-black leading-[1.1] md:text-6xl tracking-tight text-slate-950"
                    >
                      {service.heroTitle}
                    </motion.h1>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`max-w-2xl text-lg leading-relaxed md:text-xl ${
                      ["custom-tech-solutions", "web-application-development", "devops-as-a-service", "data-analytics-cloud-solutions"].includes(service.slug)
                        ? "text-slate-700 font-medium"
                        : "text-slate-600"
                    }`}
                  >
                    {service.heroSummary}
                  </motion.p>

                  <div className="pt-12 flex flex-wrap gap-4">
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 shadow-lg shadow-slate-200">
                      Talk to TECHZOQ
                    </Link>
                    <Link href="/get-quote" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                      Request a Proposal
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative group">
                <div className="absolute -inset-8 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-500/15 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-transparent rounded-[3rem] blur-2xl opacity-40" />
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-[2.5rem] border-2 border-white/30 shadow-2xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-600/5 via-transparent to-blue-600/5 z-10 pointer-events-none" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent z-5 pointer-events-none" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-sky-400 to-blue-400 rounded-full blur-lg opacity-15 group-hover:opacity-25 transition-opacity" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Web Tech Stack Carousel --- */}
        {(service.slug === "web-application-development" || service.slug === "web-development") && (
          <section className="relative z-20 py-16 bg-slate-50/50 overflow-hidden border-y border-slate-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-700">Enterprise Tech Stack</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Built with Modern Frameworks</h2>
            </div>
            <div className="flex whitespace-nowrap">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-6 items-center"
              >
                {[
                  { name: "Next.js 15", icon: <SiNextdotjs />, color: "bg-black/5", iconColor: "text-black" },
                  { name: "React", icon: <SiReact />, color: "bg-sky-400/10", iconColor: "text-sky-500" },
                  { name: "TypeScript", icon: <SiTypescript />, color: "bg-blue-600/10", iconColor: "text-blue-600" },
                  { name: "Node.js", icon: <SiNodedotjs />, color: "bg-green-500/10", iconColor: "text-green-600" },
                  { name: "Python", icon: <SiPython />, color: "bg-yellow-400/10", iconColor: "text-yellow-600" },
                  { name: "PostgreSQL", icon: <SiPostgresql />, color: "bg-indigo-400/10", iconColor: "text-indigo-600" },
                  { name: "MongoDB", icon: <SiMongodb />, color: "bg-emerald-500/10", iconColor: "text-emerald-600" },
                  { name: "Tailwind", icon: <SiTailwindcss />, color: "bg-cyan-400/10", iconColor: "text-cyan-500" },
                  { name: "AWS", icon: <FaAws />, color: "bg-orange-400/10", iconColor: "text-orange-500" },
                  { name: "Docker", icon: <SiDocker />, color: "bg-blue-500/10", iconColor: "text-blue-500" },
                  { name: "GraphQL", icon: <SiGraphql />, color: "bg-pink-500/10", iconColor: "text-pink-600" },
                  { name: "Redux", icon: <SiRedux />, color: "bg-purple-500/10", iconColor: "text-purple-600" }
                ].map((tech, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all hover:border-sky-300 hover:scale-105 ${tech.color} backdrop-blur-sm`}
                  >
                    <span className={`text-2xl ${tech.iconColor}`}>{tech.icon}</span>
                    <span className="text-sm font-black text-slate-800 tracking-wide">{tech.name}</span>
                  </div>
                ))}

                {/* --- Duplicate for Smooth Animation --- */}
                {[
                  { name: "Next.js 15", icon: <SiNextdotjs />, color: "bg-black/5", iconColor: "text-black" },
                  { name: "React", icon: <SiReact />, color: "bg-sky-400/10", iconColor: "text-sky-500" },
                  { name: "TypeScript", icon: <SiTypescript />, color: "bg-blue-600/10", iconColor: "text-blue-600" },
                  { name: "Node.js", icon: <SiNodedotjs />, color: "bg-green-500/10", iconColor: "text-green-600" },
                  { name: "Python", icon: <SiPython />, color: "bg-yellow-400/10", iconColor: "text-yellow-600" },
                  { name: "PostgreSQL", icon: <SiPostgresql />, color: "bg-indigo-400/10", iconColor: "text-indigo-600" },
                  { name: "MongoDB", icon: <SiMongodb />, color: "bg-emerald-500/10", iconColor: "text-emerald-600" },
                  { name: "Tailwind", icon: <SiTailwindcss />, color: "bg-cyan-400/10", iconColor: "text-cyan-500" },
                  { name: "AWS", icon: <FaAws />, color: "bg-orange-400/10", iconColor: "text-orange-500" },
                  { name: "Docker", icon: <SiDocker />, color: "bg-blue-500/10", iconColor: "text-blue-500" },
                  { name: "GraphQL", icon: <SiGraphql />, color: "bg-pink-500/10", iconColor: "text-pink-600" },
                  { name: "Redux", icon: <SiRedux />, color: "bg-purple-500/10", iconColor: "text-purple-600" }
                ].map((tech, index) => (
                  <div
                    key={`dup-${index}`}
                    className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm ${tech.color} backdrop-blur-sm`}
                  >
                    <span className={`text-2xl ${tech.iconColor}`}>{tech.icon}</span>
                    <span className="text-sm font-black text-slate-800 tracking-wide">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* --- Mobile Tech Stack Carousel --- */}
        {(service.slug === "mobile-app-development" || service.slug === "mobile-development") && (
          <section className="relative z-20 py-16 bg-slate-50/50 overflow-hidden border-y border-slate-100">
            <MobileTechStack />
          </section>
        )}

        {/* --- Introduction --- */}
        <section className="relative z-20 py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              {service.introduction.map((paragraph: string) => (
                <p key={paragraph} className="text-lg leading-relaxed text-slate-700">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* --- Best Fit Section --- */}
        {service.bestFit && <BestFit bestFit={service.bestFit} />}

        {/* --- Capabilities --- */}
        {/* --- Capabilities --- */}
        {/* --- Capabilities --- */}
        <CapabilitiesSection
          eyebrow="What This Service Covers"
          title="Capabilities built around delivery."
          subtitle="Strategic engineering solutions tailored for enterprise performance and scalability."
          capabilities={service.capabilities}
        />

        {/* --- Outcomes & Stacks --- */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="group relative rounded-[2rem] border border-slate-200/50 bg-gradient-to-br from-white via-sky-50/30 to-slate-50 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_24px_64px_rgba(14,165,233,0.2)] hover:border-sky-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-hover:from-sky-500/3 group-hover:to-blue-500/3 transition-all duration-300" />
                <div className="relative">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Typical Outcomes</p>
                  <div className="mt-6 space-y-3">
                    {service.outcomes.map((outcome: string) => (
                      <div key={outcome} className="flex gap-3 rounded-2xl border border-sky-200/40 bg-gradient-to-r from-sky-50/80 to-blue-50/50 px-4 py-3 text-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500 flex-shrink-0" />
                        <span className="text-sm font-medium">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="group relative rounded-[2rem] border border-slate-200/50 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_24px_64px_rgba(14,165,233,0.2)] hover:border-sky-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-hover:from-sky-500/3 group-hover:to-blue-500/3 transition-all duration-300" />
                <div className="relative">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Technology and Delivery Stack</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {service.stacks.map((stack: string) => (
                      <span key={stack} className="rounded-full border border-sky-300/40 bg-gradient-to-r from-sky-100/60 to-blue-100/40 px-4 py-2 text-sm font-medium text-sky-900 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">{stack}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Process Section --- */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Delivery Approach</p>
              <h2 className="mt-4 text-3xl font-black md:text-4xl text-slate-950">A clear implementation path.</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-4">
              {service.process.map((step: any, index: number) => (
                <div key={step.title} className="group relative rounded-[1.75rem] border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100/50 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_64px_rgba(14,165,233,0.15)] hover:border-sky-300/40 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 via-transparent to-blue-500/5 group-hover:from-sky-400/10 group-hover:to-blue-500/10 transition-all duration-300" />
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">FAQ</p>
              <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Common Questions.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {service.faqs.map((faq: any) => (
                <details key={faq.question} className="group rounded-[1.5rem] border border-slate-200/50 bg-gradient-to-r from-white to-slate-50 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(14,165,233,0.12)] open:border-sky-300/50 open:shadow-[0_18px_50px_rgba(14,165,233,0.15)] open:bg-gradient-to-r open:from-sky-50/50 open:to-blue-50/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-open:from-sky-500/3 group-open:to-blue-500/3 transition-all duration-300" />
                  <summary className="relative cursor-pointer list-none text-lg font-semibold text-slate-950 transition-colors duration-200 group-open:text-sky-700">{faq.question}</summary>
                  <p className="relative mt-4 text-base leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* --- Related Services --- */}
        {relatedServices.length > 0 && (
          <section className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Related Services</p>
                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Adjacent capabilities.</h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedServices.map((related: any) => (
                  <article key={related.slug} className="group relative rounded-[1.75rem] border border-slate-200/50 bg-gradient-to-br from-white via-slate-50/30 to-slate-100/20 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_20px_56px_rgba(14,165,233,0.18)] hover:border-sky-300/50 hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-hover:from-sky-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
                    <div className="relative">
                      <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 p-3 text-sky-700 w-fit shadow-sm group-hover:shadow-md transition-all duration-200">
                        <ServiceIcon icon={related.icon} className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-xl font-black text-slate-950">{related.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{related.teaser}</p>
                      <Link href={related.path} className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-800 transition-colors duration-200 group-hover:gap-3">
                        View details <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}