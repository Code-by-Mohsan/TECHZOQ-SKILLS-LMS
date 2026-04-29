"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const quotes = [
    {
      name: "Aisha K.",
      role: "CTO, Fintech",
      text: "TECHZOQ helped us deliver a market-winning product in months. Their technical expertise and dedication exceeded our expectations.",
      avatar: "AK",
      rating: 5,
    },
    {
      name: "Roberto M.",
      role: "VP Product",
      text: "Great engineering, clear communication and solid outcomes. The team consistently delivered high-quality work on time.",
      avatar: "RM",
      rating: 5,
    },
    {
      name: "Sana P.",
      role: "Head of Data",
      text: "Their ML expertise directly improved our conversion rates. We saw a 40% increase in just three months.",
      avatar: "SP",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">
              Client Success
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Product Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our partners say about
            working with TECHZOQ.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quotes.map((q, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              {/* Gradient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-50 transition duration-1000" />

              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(q.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-gray-700 mb-8 leading-relaxed flex-grow relative z-10">
                  "{q.text}"
                </blockquote>

                {/* Author */}
                <figcaption className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {q.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{q.name}</div>
                    <div className="text-sm text-gray-500">{q.role}</div>
                  </div>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {["TechCorp", "DataFlow", "CloudNext", "AI Labs", "DevStart"].map(
              (company, i) => (
                <div key={i} className="text-2xl font-black text-gray-400">
                  {company}
                </div>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
