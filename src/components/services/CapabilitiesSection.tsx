"use client";

import { motion } from "framer-motion";
// Individually import karein taake koi doubt na rahe
import {
    HiOutlineSquare3Stack3D,
    HiOutlineCube,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineLink,
    HiOutlineCircleStack,
    HiOutlineArrowTrendingUp,
    HiOutlineSparkles,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineTicket,
    HiOutlineChartBar
} from "react-icons/hi2";

// Icons ka mapping object
const ICON_COMPONENTS: any = {
    0: HiOutlineSquare3Stack3D,
    1: HiOutlineCube,
    2: HiOutlineUserGroup,
    3: HiOutlineShieldCheck,
    4: HiOutlineLink,
    5: HiOutlineCircleStack,
    6: HiOutlineArrowTrendingUp,
    7: HiOutlineSparkles,
    8: HiOutlineClock,
    9: HiOutlineCheckCircle,
    10: HiOutlineTicket,
    11: HiOutlineChartBar
};

interface CapabilitiesSectionProps {
    eyebrow?: string;
    title: string;
    subtitle: string;
    capabilities: string[];
}

export default function CapabilitiesSection({
    eyebrow = "EXPERT ENGINEERING",
    title,
    subtitle,
    capabilities,
}: CapabilitiesSectionProps) {

    if (!capabilities || capabilities.length === 0) return null;

    return (
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 max-w-3xl mx-auto"
                >
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">{eyebrow}</p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-8 leading-tight">{title}</h2>
                    <p className="text-lg text-slate-500 leading-relaxed">{subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((cap, index) => {
                        const [capTitle, capDescription] = cap.split(" | ");
                        // Direct index se icon uthayein
                        const IconComponent = ICON_COMPONENTS[index % 12];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-300"
                            >
                                <div className="relative space-y-6">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
                                        {/* Icon rendering */}
                                        {IconComponent && <IconComponent className="w-8 h-8 text-emerald-600 block" />}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug">{capTitle}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{capDescription}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}