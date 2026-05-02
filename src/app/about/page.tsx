"use client";

import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Target,
  Eye,
  Heart,
  Zap,
  Users,
  Award,
  TrendingUp,
  Code2,
  Lightbulb,
  Rocket,
  Globe,
} from "lucide-react";

// Lazy load Header component
const Header = dynamic(() => import("@/components/Header"), {
  loading: () => <div className="h-20" />,
  ssr: true,
});

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Code2,
      title: "Excellence in Code",
      desc: "We write clean, maintainable, and efficient code using best practices and industry standards.",
    },
    {
      icon: Users,
      title: "Client-Centric",
      desc: "Your success is our success. We focus on understanding and exceeding your expectations.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      desc: "We stay ahead with cutting-edge technologies and creative problem-solving approaches.",
    },
    {
      icon: Heart,
      title: "Passionate Team",
      desc: "Our developers love what they do and are committed to delivering exceptional results.",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      desc: "We work with clients and partners worldwide, bringing diverse perspectives to every project.",
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      desc: "We invest in our team's growth through training, mentorship, and knowledge sharing.",
    },
  ];

  const stats = [
    { value: "50+", label: "Projects Delivered", icon: Code2 },
    { value: "100+", label: "Students Trained", icon: Users },
    { value: "15+", label: "Team Members", icon: Award },
    { value: "5+", label: "Years Experience", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black pt-32 pb-20">
        {/* Video Background - Lazy Loaded */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
          preload="metadata"
        >
          <source src="/images/portfolio/vedio4.mp4" type="video/mp4" />
        </video>

        {/* Overlay Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-blue-900/40 z-[1]" />

        {/* Mesh Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-[2]" />

        {/* Main Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              About <span className="text-blue-500">TECHZOQ</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Building a real tech learning environment in Kasur for students
              who want practical skills, projects, and career direction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-6 italic">Our Story</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  TECHZOQ was built to solve a practical problem: ambitious
                  students in Kasur wanted to enter technology, but most local
                  learning options were still focused on outdated theory.
                </p>
                <p>
                  We created TECHZOQ as a real software learning environment
                  where students can understand current tools and build practical
                  projects that actually matter.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: Target, title: "Founded", text: "2020" },
                  { icon: Users, title: "Team Size", text: "15+ Experts" },
                  { icon: Globe, title: "Global Reach", text: "10+ Countries" },
                  { icon: Award, title: "Projects", text: "50+ Delivered" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm"
            >
              <Target className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To help students build practical tech skills through project-based learning and serious mentorship.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm"
            >
              <Eye className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To make Kasur a hub for world-class tech talent and professional digital experts.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm"
            >
              <Zap className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrity, discipline, and honest guidance are at the heart of everything we do.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="text-5xl font-black mb-2">{stat.value}</div>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to start?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Browse Courses
            </Link>
            <Link
              href="/demo-class"
              className="border-2 border-blue-600 text-blue-600 font-bold py-4 px-10 rounded-2xl hover:bg-blue-50 transition-all"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;