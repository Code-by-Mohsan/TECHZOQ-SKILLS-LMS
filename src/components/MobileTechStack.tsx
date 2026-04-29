"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Icons ko import karne se pehle check karein ke react-icons install hai
import {
    SiFlutter,
    SiReact,
    SiKotlin,
    SiSwift,
    SiFirebase,
    SiNodedotjs,
    SiMongodb,
    SiTypescript
} from "react-icons/si";

const techStack = [
    { name: "Flutter", icon: <SiFlutter />, color: "bg-sky-400/10", iconColor: "text-sky-400" },
    { name: "React Native", icon: <SiReact />, color: "bg-blue-400/10", iconColor: "text-blue-400" },
    { name: "Kotlin", icon: <SiKotlin />, color: "bg-purple-400/10", iconColor: "text-purple-400" },
    { name: "Swift", icon: <SiSwift />, color: "bg-orange-400/10", iconColor: "text-orange-400" },
    { name: "Firebase", icon: <SiFirebase />, color: "bg-yellow-400/10", iconColor: "text-yellow-400" },
    { name: "Node.js", icon: <SiNodedotjs />, color: "bg-green-400/10", iconColor: "text-green-400" },
    { name: "MongoDB", icon: <SiMongodb />, color: "bg-emerald-400/10", iconColor: "text-emerald-400" },
    { name: "TypeScript", icon: <SiTypescript />, color: "bg-blue-500/10", iconColor: "text-blue-500" },
];

export default function MobileTechStack() {
    const [mounted, setMounted] = useState(false);

    // Hydration error se bachne ke liye useEffect use karein
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const duplicatedStack = [...techStack, ...techStack];

    return (
        <div className="relative w-full overflow-hidden bg-white py-12">
            <div className="relative z-10">
                <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                    Our Mobile Tech Stack
                </p>

                <div className="flex w-full overflow-hidden">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 30,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {duplicatedStack.map((tech, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-4 rounded-3xl border border-slate-100 ${tech.color} px-8 py-5 backdrop-blur-sm transition-all hover:border-sky-300 hover:scale-105`}
                            >
                                <span className={`text-4xl ${tech.iconColor}`}>{tech.icon}</span>
                                <span className="text-xl font-bold text-slate-800">{tech.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Glassy Fading Edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />
        </div>
    );
}