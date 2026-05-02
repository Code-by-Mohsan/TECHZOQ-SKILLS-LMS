"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Check, Zap, Code2, Send, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import PortfolioCard from "@/components/PortfolioCard";
import { portfolioItems } from "@/data/portfolio";

// ===== HERO SECTION =====
const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-0 mt-0">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#f1f5f9]"></div>

            {/* Background blobs */}
            <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-blue-500/10 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-3xl opacity-50"></div>

            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-6xl mx-auto space-y-5"
                >
                    {/* OUR LATEST WORKS */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-2"
                    >
                        <div className="px-5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
                            <span className="text-xs font-bold text-[#00D1B2] tracking-widest uppercase">
                                ✨ Our Latest Works
                            </span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0f172a] leading-tight tracking-tight"
                    >
                        Practical Skills for <span className="text-[#00D1B2]">Real Environments</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-base md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed"
                    >
                        Master the skills required to excel in actual software engineering roles across the globe.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <button className="px-10 py-3.5 bg-[#024d82] text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition-all active:scale-95">
                            Explore Projects
                        </button>

                        <button className="px-10 py-3.5 bg-white text-slate-900 font-bold rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                            Get in Touch
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

// ===== CLIENT LOGOS SECTION =====
const clients = [
    { name: "Connairo", stars: 5, logo: "/logos/connairo-logo.png" },
    { name: "Hamidiye", stars: 5, logo: "/logos/humidity-logo.png" },
    { name: "Pakka Khata", stars: 5, logo: "/logos/pakka-khata-logo.png" },
    { name: "CLKD Pay", stars: 4, color: "group-hover:text-blue-800", logo: "/logos/clkdpay-logo.png" },
    { name: "Zing", stars: 5, color: "group-hover:text-cyan-600", logo: "/logos/zing-logo.png" },
    { name: "SPIXHOST", stars: 5, color: "group-hover:text-blue-500", logo: "/logos/spixhost-logo.png" },
    { name: "EOLL Recruitment", stars: 5, logo: "/logos/eoll-logo.png" },
    { name: "Bilal", stars: 5, logo: "/logos/bilal-logo.png" },
    { name: "Corner", stars: 5, logo: "/logos/corner-logo.png" },
    { name: "Digital", stars: 5, logo: "/logos/digital-logo.png" },
];


const ClientLogosSection = () => {
    return (
        <section className="py-20 bg-slate-50/50 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center mb-10">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Our Trusted Clients</h2>
                </div>

                <div className="relative flex overflow-hidden group">
                    <motion.div
                        className="flex whitespace-nowrap gap-12"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 25,
                        }}
                    >
                        {[...clients, ...clients].map((client, index) => (
                            <div
                                key={`${client.name}-${index}`}
                                className="flex flex-col items-center min-w-[150px]"
                            >
                                <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-4 p-4 relative">
                                    {client.logo ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={client.logo}
                                                alt={client.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <svg viewBox="0 0 24 24" className={`w-12 h-12 fill-current ${client.color || 'text-slate-400'}`}>
                                            <path d={client.logo} />
                                        </svg>
                                    )}
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">
                                    {client.name}
                                </h4>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-[8px] ${i < client.stars ? 'text-yellow-400' : 'text-slate-200'}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50/50 to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50/50 to-transparent z-10"></div>
                </div>
            </div>
        </section>
    );
};

// ===== FEATURED PROJECT SECTION =====
const FeaturedProjectSection = () => {
    const featured = {
        title: "Pakka Khata",
        description: "Smart AI-ERP streamlining business operations, inventory, and real-time accounts. A comprehensive solution designed to simplify financial management and operational efficiency across 100+ accounts.",
        image: "/images/portfolio/pakka khata.png",
        achievements: [
            { label: "100+ Accounts", icon: "📊", color: "text-blue-600" },
            { label: "Workforce Analytics", icon: "📈", color: "text-indigo-600" },
            { label: "Real-time Processing", icon: "⚡", color: "text-amber-500" },
        ],
        technologies: [
            { name: "Python", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
            { name: "TensorFlow", bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
            { name: "Data Analytics", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
            { name: "Visualization", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
        ],
    };

    return (
        <section className="py-24 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-12">
                    <div className="text-center space-y-4">
                        <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest">Spotlight</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Featured Project</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">A showcase of cutting-edge development bringing innovation to the industry</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="relative group rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white">
                            <Image src={featured.image} alt={featured.title} width={800} height={600} className="object-cover group-hover:scale-105 transition-all duration-700" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent italic">{featured.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">{featured.description}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {featured.achievements.map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                                        <div className="text-2xl mb-2">{item.icon}</div>
                                        <p className={`text-[11px] font-bold uppercase ${item.color}`}>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {featured.technologies.map((tech, i) => (
                                    <span key={i} className={`px-4 py-1.5 rounded-lg ${tech.bg} border ${tech.border} ${tech.text} text-xs font-bold transition-all hover:-translate-y-1`}>{tech.name}</span>
                                ))}
                            </div>
                            <button className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all active:scale-95">
                                <span className="relative z-10 flex items-center gap-2">View Full Project →</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
// ===== PROCESS SECTION (MODERN ROADMAP) =====
const ProcessSection = () => {
    const steps = [
        {
            number: "01",
            title: "Discovery",
            description: "Deep dive into your requirements and business goals to set a solid foundation.",
            icon: "🔍"
        },
        {
            number: "02",
            title: "Design",
            description: "Crafting modern, user-centric interfaces with a focus on minimalist aesthetics.",
            icon: "🎨"
        },
        {
            number: "03",
            title: "Development",
            description: "Turning designs into high-performance, scalable code using modern tech stacks.",
            icon: "💻"
        },
        {
            number: "04",
            title: "Support",
            description: "Continuous monitoring and updates to ensure your product stays ahead of the curve.",
            icon: "🚀"
        },
    ];

    return (
        <section className="py-28 bg-[#f8fafc] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-100/40 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-teal-100/30 rounded-full blur-[100px] -z-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[#00D1B2] font-bold text-sm uppercase tracking-[0.3em]"
                    >
                        Our Strategic Approach
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 leading-tight"
                    >
                        The Roadmap to <span className="text-blue-600">Excellence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-slate-500 text-lg"
                    >
                        We follow a systematic process to ensure every project is delivered with precision and high-quality standards.
                    </motion.p>
                </div>

                {/* Roadmap Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            {/* Card Container */}
                            <div className="h-full p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] hover:-translate-y-2 group-hover:border-blue-200">

                                {/* Top Decoration: Number and Icon */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="text-5xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">
                                        {step.number}
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Decorative Line */}
                                <div className="mt-6 w-10 h-1 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-blue-600 transition-all duration-500"></div>
                            </div>

                            {/* Connecting Arrow for Desktop (only for first 3 cards) */}
                            {i < 3 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 translate-y-[-50%] z-20">
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="text-slate-300 text-2xl"
                                    >
                                        →
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
// ===== CONTACT SECTION =====
const ContactCTASection = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">Ready to bring your <span className="text-blue-600">ideas to life?</span></h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Mail className="text-blue-600" />
                                <div><p className="text-xs font-bold text-slate-400 uppercase">Email Us</p><p className="text-slate-900 font-bold">support@techzoq.com</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-indigo-600" />
                                <div><p className="text-xs font-bold text-slate-400 uppercase">Call Anytime</p><p className="text-slate-900 font-bold">+92 323 1001246</p></div>
                            </div>
                        </div>
                    </div>
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-5">
                            <input type="text" placeholder="Your Name" className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                            <input type="email" placeholder="Email Address" className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                        </div>
                        <textarea rows={4} placeholder="Message..." className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 resize-none"></textarea>
                        <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all">Send Message <Send size={18} className="inline ml-2" /></button>
                    </form>
                </div>
            </div>
        </section>
    );
};

// ===== MAIN PAGE COMPONENT =====
export default function PortfolioPageClient() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <HeroSection />
                <ClientLogosSection />
                <FeaturedProjectSection />

                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Portfolio</h2>
                            <p className="mt-4 text-slate-600">Explore our diverse range of successful projects</p>
                        </div>

                        {/* Updated Grid for equal size cards */}
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto items-stretch">
                            <AnimatePresence mode="popLayout">
                                {portfolioItems.filter((item) => item.id !== "6").map((item) => {
                                    return (
                                        <motion.div
                                            layout
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                            className="flex h-full w-full"
                                        >
                                            <div className="w-full">
                                                <PortfolioCard portfolio={item} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>

                <ProcessSection />
                <ContactCTASection />
            </main>
        </>
    );
}