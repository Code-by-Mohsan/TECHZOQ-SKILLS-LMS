"use client";

import { motion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { BsBuildingCheck, BsRocket, BsGraphUp } from "react-icons/bs";

interface BestFitCard {
    title: string;
    description: string;
    features: string[];
    icon: string;
}

interface BestFitProps {
    bestFit?: BestFitCard[];
}

const iconMap: { [key: string]: React.ReactNode } = {
    building: <BsBuildingCheck className="w-5 h-5" />,
    rocket: <BsRocket className="w-5 h-5" />,
    chart: <BsGraphUp className="w-5 h-5" />,
};

export default function BestFit({ bestFit }: BestFitProps) {
    if (!bestFit || bestFit.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700 mb-4">
                        Partnerships
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-950">
                        Who we're a Best Fit for
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestFit.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-slate-50/30 to-slate-100 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(14,165,233,0.15)] hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-hover:from-sky-500/5 group-hover:to-blue-500/5 transition-all duration-300" />

                            <div className="relative space-y-4">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-600">
                                    {iconMap[card.icon] || iconMap.building}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-slate-950">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {card.description}
                                </p>

                                {/* Features List */}
                                <div className="space-y-2 pt-2">
                                    {card.features.map((feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            className="flex items-start gap-2 text-sm text-slate-700"
                                        >
                                            <HiOutlineCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
