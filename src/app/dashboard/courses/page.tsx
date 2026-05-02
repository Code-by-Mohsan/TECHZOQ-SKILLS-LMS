"use client";

import { Search, Filter, MoreHorizontal, ArrowUpRight } from "lucide-react";

const courses = [
  { 
    id: 1,
    title: "UI/UX Design Fundamentals", 
    tutor: "Sara Ahmed", 
    prog: 72, 
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=600&q=80", 
    lessons: "17 / 24 lessons", 
    cat: "Design",
    color: "bg-blue-500"
  },
  { 
    id: 2,
    title: "Data Science with Python", 
    tutor: "Dr. Imran Khan", 
    prog: 45, 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", 
    lessons: "14 / 32 lessons", 
    cat: "Data",
    color: "bg-cyan-500"
  },
  { 
    id: 3,
    title: "Modern Web Development", 
    tutor: "Hassan Ali", 
    prog: 88, 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80", 
    lessons: "24 / 28 lessons", 
    cat: "Engineering",
    color: "bg-orange-500"
  },
  // Duplicating for the 2nd row as seen in screenshot
  { 
    id: 4,
    title: "UI/UX Design Fundamentals", 
    tutor: "Sara Ahmed", 
    prog: 72, 
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=600&q=80", 
    lessons: "17 / 24 lessons", 
    cat: "Design",
    color: "bg-blue-500"
  },
  { 
    id: 5,
    title: "Data Science with Python", 
    tutor: "Dr. Imran Khan", 
    prog: 45, 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", 
    lessons: "14 / 32 lessons", 
    cat: "Data",
    color: "bg-cyan-500"
  },
  { 
    id: 6,
    title: "Modern Web Development", 
    tutor: "Hassan Ali", 
    prog: 88, 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80", 
    lessons: "24 / 28 lessons", 
    cat: "Engineering",
    color: "bg-orange-500"
  }
];

export default function MyCourses() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Courses</h2>
          <p className="text-xs text-gray-400 font-bold mt-1">
            6 enrolled • 1 completed this term
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={14} className="text-indigo-600" />
            Filter
          </button>
        </div>
      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-xl transition-all duration-500">
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden">
              <img 
                src={course.img} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              
              {/* Category Badge */}
              <span className="absolute top-5 left-5 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/20">
                {course.cat}
              </span>

              {/* Action Overlay (Optional but adds polish) */}
              <button className="absolute top-5 right-5 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-7">
              <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-tight">
                {course.tutor}
              </p>
              <h3 className="text-[17px] font-black text-gray-800 mb-6 leading-tight min-h-[44px]">
                {course.title}
              </h3>

              {/* Progress Info */}
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[11px] font-bold text-gray-400">
                  {course.lessons}
                </span>
                <span className="text-[11px] font-black text-gray-900">
                  {course.prog}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-[#7B61FF] h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${course.prog}%` }} 
                />
              </div>

              {/* Action Button */}
              <button className="w-full py-4 bg-[#1E1E2D] text-white rounded-2xl text-[12px] font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}