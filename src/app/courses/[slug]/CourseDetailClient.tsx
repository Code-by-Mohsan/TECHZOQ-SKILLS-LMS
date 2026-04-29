"use client";

import Link from "next/link";
import Header from "@/components/Header";
import {
  Clock,
  BarChart,
  CheckCircle2,
  User,
  Award,
  Users,
  Star,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export interface CourseDetailData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  level: string;
  duration: string;
  thumbnail?: string;
  features?: string[];
  curriculum?: { title: string; topics: string[] }[];
  instructor?: { name: string; bio: string; avatar: string };
  price?: number;
}

export default function CourseDetailClient({
  course,
}: {
  course: CourseDetailData;
}) {
  const instructor = course.instructor || {
    name: "TechZoq Team",
    bio: "Expert Instructors",
    avatar: "",
  };
  const features = course.features || [];
  const curriculum = course.curriculum || [];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "TECHZOQ Skills",
      sameAs: "https://techzoq.com",
    },
    educationalLevel: course.level,
    ...(course.duration && { timeRequired: course.duration }),
    ...(course.category && { courseCode: course.category }),
    ...(course.price ? { offers: { "@type": "Offer", price: course.price, priceCurrency: "PKR" } } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Courses",
        item: "https://techzoq.com/courses",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: course.title,
        item: `https://techzoq.com/courses/${course.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative pt-32 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-gray-600 mb-6"
                >
                  <Link href="/courses" className="hover:text-primary-600 transition-colors">
                    Courses
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{course.category}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm mb-6 shadow-lg shadow-blue-500/30"
                >
                  <Star className="w-4 h-4 fill-current" />
                  {course.category}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  {course.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-700 mb-8 leading-relaxed"
                >
                  {course.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-6 mb-8"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">In-Person Classes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-900">Certificate</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href={`/apply?course=${course.slug}`}
                    onClick={() =>
                      trackEvent("apply_cta_click", {
                        location: "course_detail_primary",
                        course_slug: course.slug,
                      })
                    }
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Apply Now</span>
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Your Instructor
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {instructor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{instructor.name}</p>
                      <p className="text-sm text-gray-600">{instructor.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.9</span>
                    <span>(1,234 reviews)</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    What You&apos;ll Get
                  </h2>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <motion.li
                        key={`${feature}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <BookOpen className="w-10 h-10 text-blue-600" />
                Course Curriculum
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive learning path designed by industry experts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {curriculum.map((module, index) => (
                <motion.div
                  key={`${module.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{module.topics.length} topics</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 pl-4 border-l-2 border-blue-200 ml-6">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={`${topic}-${topicIndex}`} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">&bull;</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative py-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Apply now and join our in-person classes.
            </p>
            <Link
              href={`/apply?course=${course.slug}`}
              onClick={() =>
                trackEvent("apply_cta_click", {
                  location: "course_detail_footer",
                  course_slug: course.slug,
                })
              }
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg"
            >
              <span>Apply Now</span>
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

