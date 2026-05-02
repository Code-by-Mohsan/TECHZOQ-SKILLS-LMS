"use client";

import { useDeferredValue, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import CoursesFilter from "@/components/CoursesFilter";
import { Sparkles, TrendingUp, Award } from "lucide-react";

export interface CourseListItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  description?: string;
  thumbnail?: string;
}

export default function CoursesPageClient({
  initialCourses,
}: {
  initialCourses: CourseListItem[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const allCourses = initialCourses.map((course) => ({
    id: course._id,
    title: course.title,
    slug: course.slug,
    category: course.category,
    level: course.level,
    duration: course.duration,
    description: course.description || "",
    thumbnail: course.thumbnail,
  }));

  const categories = Array.from(new Set(allCourses.map((course) => course.category)));

  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const query = deferredSearchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialCourses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://techzoq.com/courses/${course.slug}`,
      name: course.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <div className="min-h-screen bg-[#fcfdfe]">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-96 h-96 bg-[#00D1B2]/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-[#004a80]/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* HERO SECTION - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

              {/* Left Side: Text Content */}
              <div className="text-left space-y-6 order-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00D1B2] to-[#004a80] text-white font-bold text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-[#00D1B2]/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Our Premium Courses</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-black text-[#004a80] leading-[1.1] tracking-tight"
                >
                  Master the Skills of <br />
                  <span
                    style={{
                      background: "linear-gradient(to right, #00D1B2, #004a80)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "inline-block"
                    }}
                  >
                    Tomorrow
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium"
                >
                  From AI to Full-Stack Development, unlock your potential with
                  industry-leading practical courses designed by TECHZOQ.
                </motion.p>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#004a80]/5 text-[#004a80]"><TrendingUp className="w-5 h-5" /></div>
                    <div className="text-left">
                      <div className="text-xl font-black text-[#004a80]">2,000+</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Students</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00D1B2]/10 text-[#00D1B2]"><Award className="w-5 h-5" /></div>
                    <div className="text-left">
                      <div className="text-xl font-black text-[#004a80]">{initialCourses.length}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Courses</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side: Image Content */}
              {/* Right Side Image - Fixed Implementation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative lg:ml-auto order-2"
              >
                {/* Glassmorphism Effect / Outer Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#00D1B2]/20 to-[#004a80]/10 blur-2xl rounded-[4rem]" />

                <div className="relative z-10 backdrop-blur-lg bg-white/10 p-3 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,74,128,0.15)] border border-white/20">
                  <div className="rounded-[2.8rem] overflow-hidden">
                    <img
                      src="/images/portfolio/skill.png"
                      alt="TECHZOQ Training"
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Decorative Badge (Optional - visually balances the image) */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-8 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-[#004a80]">Live Training Sessions</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <CoursesFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onSearchChange={setSearchQuery}
              />
            </motion.div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.08 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#004a80] mb-2 uppercase tracking-tight">
                  No courses found
                </h3>
                <p className="text-slate-500 font-medium">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </div> {/* closing for max-w-7xl */}
        </div> {/* closing for relative pt-32 */}
      </div> {/* closing for min-h-screen */}
    </>
  );
}