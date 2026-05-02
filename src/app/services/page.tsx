"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import ServiceIcon from "@/components/services/ServiceIcon";
import CapabilitiesSection from "@/components/services/CapabilitiesSection";
import {
  SERVICE_ENTRIES,
  SERVICE_ROUTE_ENTRIES,
} from "@/lib/content/services";

export default function ServicesPage() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    setVersion(`?v=${Date.now()}`);
  }, []);

  const directorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TECHZOQ Services",
    itemListElement: SERVICE_ROUTE_ENTRIES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `https://techzoq.com${service.path}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Script
        id="services-directory-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />

      <Header />

      <main id="main">
        {/* --- REFINED HERO SECTION WITH BETTER ALIGNMENT --- */}
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

        {/* --- Services Grid Section --- */}
        <section className="py-24 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {SERVICE_ENTRIES.map((service) => (
                <article key={service.slug} className="group rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-sky-300 hover:shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-sky-50 p-4 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <ServiceIcon icon={service.icon} className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-600">
                      {service.eyebrow}
                    </span>
                  </div>
                  <h2 className="mt-8 text-2xl font-black text-slate-950 leading-tight transition-colors group-hover:text-sky-800">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {service.teaser}
                  </p>
                  <ul className="mt-8 space-y-3 text-sm text-slate-700">
                    {service.capabilities.slice(0, 3).map((capability) => (
                      <li key={capability} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span className="font-medium">{capability}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={service.path} className="mt-8 inline-flex items-center gap-2 font-bold text-sky-700 transition hover:gap-3">
                    Explore service details <span className="text-xl">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- Delivery Capabilities Section --- */}
        <CapabilitiesSection
          eyebrow="DELIVERY EXCELLENCE"
          title="Delivery Capabilities"
          subtitle="We ensure seamless project execution with agile methodologies, transparent communication, and continuous quality assurance throughout every phase of development."
          capabilities={[
            "Agile Project Management | Sprint-based delivery with iterative development cycles ensuring rapid time-to-market and adaptive planning.",
            "Quality Assurance | Comprehensive testing protocols maintaining zero-defect standards and performance excellence throughout the delivery lifecycle.",
            "Transparent Communication | Real-time progress tracking and stakeholder updates providing complete visibility into project status.",
            "Continuous Integration | Automated deployment pipelines enabling frequent releases with minimal downtime and maximum reliability.",
            "Risk Management | Proactive identification and mitigation of potential blockers ensuring smooth project progression.",
            "Post-Launch Support | Dedicated monitoring and optimization ensuring sustained performance and user satisfaction post-deployment."
          ]}
        />
      </main>
    </div>
  );
}