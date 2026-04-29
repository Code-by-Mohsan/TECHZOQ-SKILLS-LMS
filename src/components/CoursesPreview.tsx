"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Clock, ArrowRight, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface PreviewCourse {
  _id: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
}

const GRADIENTS = [
  "from-purple-600 to-pink-600",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-orange-500 to-red-500",
  "from-indigo-600 to-purple-600",
  "from-pink-500 to-rose-500",
];

const CoursesPreview: React.FC = () => {
  const [courses, setCourses] = useState<PreviewCourse[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setCourses((json.data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              <span className="text-sm font-bold uppercase tracking-wider">
                Learn & Grow
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Featured{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Upskill with practical, hands-on learning from industry experts.
              Build real projects and accelerate your career.
            </p>
          </div>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors"
          >
            See All Courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((c, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                {/* Gradient Glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-75 transition duration-1000`}
                />

                {/* Card */}
                <div className="relative h-full bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 flex flex-col">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                    {c.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow line-clamp-3">
                    {c.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{c.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>In-Person</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/apply?course=${c.slug}`}
                    onClick={() =>
                      trackEvent("apply_cta_click", {
                        location: "homepage_courses_preview",
                        course_slug: c.slug,
                      })
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} text-white font-bold py-4 rounded-xl group-hover:shadow-lg transition-all duration-300`}
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
