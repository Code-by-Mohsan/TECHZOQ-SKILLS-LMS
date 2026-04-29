"use client";

import { motion } from "framer-motion";

interface PortfolioCardProps {
    portfolio: {
        id: string;
        title: string;
        description: string;
        category: string;
        image?: string;
        technologies: string[];
        highlights: string[];
    };
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="group relative h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
        >
            {/* IMAGE */}
            <div className="relative w-full aspect-video overflow-hidden">
                {portfolio.image ? (
                    <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-4">

                    {/* CATEGORY */}
                    <span className="text-xs text-white bg-white/20 backdrop-blur px-3 py-1 rounded-full w-fit mb-2">
                        {portfolio.category}
                    </span>

                    {/* TITLE ON HOVER */}
                    <h3 className="text-white text-lg font-semibold">
                        {portfolio.title}
                    </h3>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {portfolio.title}
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 flex-grow">
                    {portfolio.description}
                </p>

                {/* BUTTON */}
                <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                    View Details →
                </button>
            </div>
        </motion.div>
    );
}