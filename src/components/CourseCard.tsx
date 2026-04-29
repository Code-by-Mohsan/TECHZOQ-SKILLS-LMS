"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BarChart, ChevronRight, Star, Users } from 'lucide-react';

interface CourseProps {
  course: {
    id: string;
    title: string;
    slug: string;
    category: string;
    level: string;
    duration: string;
    thumbnail?: string;
  };
}

export default function CourseCard({ course }: CourseProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image / Gradient Placeholder */}
      <div className="relative h-48 w-full overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 text-xs font-bold tracking-wider text-white uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
            {course.category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-bold text-gray-900">4.9</span>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-purple-600" />
            <span className="font-medium">{course.level}</span>
          </div>
        </div>

        {/* Students Count */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Users className="w-4 h-4 text-green-600" />
          <span className="font-medium">In-Person Classes</span>
        </div>

        {/* CTA Button */}
        <Link
          href={`/courses/${course.slug}`}
          className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 group-hover:scale-105"
        >
          <span>View Course</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none -z-10" />
    </motion.div>
  );
}
