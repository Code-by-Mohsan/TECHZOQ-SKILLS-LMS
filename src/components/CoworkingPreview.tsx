"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Coffee, Wifi, Users2, ArrowRight } from "lucide-react";

export default function CoworkingPreview() {
  const features = [
    { icon: Coffee, label: "Free Coffee" },
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Users2, label: "Community Events" },
    { icon: MapPin, label: "Prime Location" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              <span className="text-sm font-bold uppercase tracking-wider">
                Workspace & Community
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Work Where
              <span className="block bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Innovation Happens
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Join a vibrant community of builders, makers, and startups.
              Flexible desks, private offices, and inspiring event spaces
              designed for collaboration and growth.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {f.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/coworking">
                <div className="group relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold group-hover:scale-105 transition-transform">
                    Explore Coworking
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-900 px-8 py-4 rounded-xl font-bold hover:border-orange-500 hover:shadow-lg transition-all"
              >
                Book a Tour
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative group">
              {/* Gradient Border */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-pink-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/co-space.jpg"
                  alt="Modern Coworking Space"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
              >
                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  50+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Active Members
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
