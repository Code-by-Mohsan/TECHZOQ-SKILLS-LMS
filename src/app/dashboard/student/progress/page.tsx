"use client";

import { ArrowUpRight, TrendingUp, Calendar, Zap, Target } from "lucide-react";

export default function Progress() {
  const stats = [
    { label: "Overall Completion", val: "72%", sub: "+8% vs term avg", icon: <Target size={18} className="text-indigo-500" /> },
    { label: "Average Score", val: "87%", sub: "+4 pts", icon: <TrendingUp size={18} className="text-green-500" /> },
    { label: "Quizzes Taken", val: "32", sub: "of 41", icon: <Zap size={18} className="text-amber-500" /> },
    { label: "Study Streak", val: "12d", sub: "personal best", icon: <Calendar size={18} className="text-red-500" /> },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      
      {/* 1. HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-black text-gray-900">Your Progress</h2>
        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">
          A complete view of your learning performance.
        </p>
      </div>

      {/* 2. TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-2xl">{s.icon}</div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-gray-800">{s.val}</h4>
              <span className="text-[9px] font-bold text-gray-400 uppercase">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Completion Trend - Area Chart Style */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-bold text-gray-800 text-sm">Completion trend</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Past 8 weeks</span>
          </div>
          <div className="relative h-48 w-full">
            {/* SVG Area Chart Background */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M0,180 Q100,160 200,120 T400,100 T600,60 T800,40 L800,180 L0,180 Z" 
                fill="url(#grad1)" 
                opacity="0.2"
              />
              <path 
                d="M0,180 Q100,160 200,120 T400,100 T600,60 T800,40" 
                fill="none" 
                stroke="#7B61FF" 
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7B61FF" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between mt-6 px-1 text-[9px] text-gray-400 font-bold uppercase">
              <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span><span>W8</span>
            </div>
          </div>
        </div>

        {/* Quiz Performance - Radial Progress */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <h4 className="w-full font-bold text-gray-800 text-sm mb-8">Quiz performance</h4>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#F8FAFC" strokeWidth="12" fill="transparent" />
              <circle cx="80" cy="80" r="70" stroke="#7B61FF" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * 87) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-black text-gray-800">87%</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">avg score</p>
            </div>
          </div>
        </div>

        {/* Performance by Course - Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 text-sm mb-10">Performance by course</h4>
          <div className="flex items-end justify-between gap-4 h-48 px-4">
            {[75, 55, 90, 60, 45, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-50/50 rounded-t-xl relative h-full group">
                <div className="absolute bottom-0 w-full bg-[#7B61FF] rounded-t-xl transition-all duration-700" style={{ height: `${h}%` }} />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 uppercase whitespace-nowrap">
                  {['UI/UX', 'Data', 'Web', 'Mkt', 'Prod', 'AI'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Consistency - Mini Bar Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 text-sm mb-10">Study consistency</h4>
          <div className="flex items-end justify-between gap-2 h-32 px-2">
            {[40, 60, 30, 90, 45, 70, 50].map((h, i) => (
              <div key={i} className="w-2.5 bg-indigo-50/50 rounded-full relative h-full">
                <div className="absolute bottom-0 w-full bg-[#7B61FF] rounded-full" style={{ height: `${h}%` }} />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400">
                  {['T', 'W', 'T', 'F', 'S', 'S', 'M'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. COURSE BREAKDOWN LIST */}
      <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 text-sm mb-8">Course breakdown</h4>
        <div className="space-y-6">
          {[
            { name: "UI/UX Design Fundamentals", progress: 72 },
            { name: "Data Science with Python", progress: 45 },
            { name: "Modern Web Development", progress: 88 },
            { name: "Growth Marketing Essentials", progress: 30 },
            { name: "Product Management 360°", progress: 12 },
            { name: "Intro to Machine Learning", progress: 60 },
          ].map((course, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <p className="text-xs font-bold text-gray-700 w-64 truncate">{course.name}</p>
              <div className="flex-1 bg-gray-50 h-2 rounded-full overflow-hidden">
                <div className="bg-[#7B61FF] h-full rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <p className="text-xs font-black text-gray-900 w-10 text-right">{course.progress}%</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}