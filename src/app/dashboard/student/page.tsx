"use client";

import { ArrowUpRight, BookOpen, Trophy, Clock, CheckCircle, MoreHorizontal } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      
      {/* 1. MAIN HERO BANNER */}
      <section className="bg-gradient-to-r from-[#7B61FF] to-[#AB92FF] rounded-[32px] p-10 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-xl">
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 inline-flex items-center gap-2 border border-white/10">
            <span>🔥</span> 12-day streak
          </div>
          <h2 className="text-4xl font-bold mb-3">Welcome back, Ali Moez 👋</h2>
          <p className="text-indigo-50 text-sm mb-8 opacity-90 leading-relaxed">
            You're 72% through this week's plan. Two lessons and one quiz left to stay on track.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-[#7B61FF] px-8 py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition flex items-center gap-2 shadow-lg">
              Resume learning <ArrowUpRight size={16} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold text-sm transition border border-white/20">
              View progress
            </button>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8 md:mt-0 relative z-10">
          {[
            { label: "Active Courses", val: "6", icon: <BookOpen size={14}/> },
            { label: "Avg. Score", val: "87%", icon: <Trophy size={14}/> },
            { label: "Study Hours", val: "18.4", icon: <Clock size={14}/> },
            { label: "Completion", val: "72%", icon: <CheckCircle size={14}/> },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl w-32 border border-white/10 text-center flex flex-col items-center group hover:bg-white/20 transition-all cursor-default">
              <div className="text-white/70 mb-2">{s.icon}</div>
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-[10px] text-indigo-100 font-bold uppercase mt-1 opacity-70 tracking-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
      </section>

      {/* 2. CONTINUE LEARNING SECTION - POLISHED CARDS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Continue learning</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Pick up right where you left off.</p>
          </div>
          <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">View all <ArrowUpRight size={14}/></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "UI/UX Design Fundamentals", tutor: "Sara Ahmad", prog: 72, img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=400&q=80", lessons: "17 / 24 lessons", cat: "Design" },
            { title: "Data Science with Python", tutor: "Dr. Imran Khan", prog: 45, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", lessons: "14 / 32 lessons", cat: "Data" },
            { title: "Modern Web Development", tutor: "Hassan Ali", prog: 88, img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80", lessons: "21 / 28 lessons", cat: "Engineering" }
          ].map((course, idx) => (
            <div key={idx} className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={course.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-4 left-4 bg-[#7B61FF] text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg">{course.cat}</span>
              </div>
              <div className="p-6">
                <p className="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-wide">{course.tutor}</p>
                <h4 className="font-bold text-gray-800 mb-4 line-clamp-1 text-[15px]">{course.title}</h4>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2">
                    <span>{course.lessons}</span>
                    <span className="text-gray-800">{course.prog}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
                  <div className="bg-[#7B61FF] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${course.prog}%` }} />
                </div>
                <button className="w-full py-3.5 bg-[#1E1E2D] text-white rounded-xl text-xs font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-md">
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MIDDLE GRAPHS ROW - POLISHED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center hover:border-indigo-100 transition-colors">
          <div className="w-full flex justify-between items-center mb-8">
            <h4 className="font-bold text-gray-800 text-sm">Overall completion</h4>
            <span className="text-[10px] bg-indigo-50 px-3 py-1.5 rounded-lg text-indigo-600 font-bold uppercase tracking-wider">This term</span>
          </div>
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
              <circle cx="104" cy="104" r="90" stroke="#F8FAFC" strokeWidth="16" fill="transparent" />
              <circle cx="104" cy="104" r="90" stroke="#7B61FF" strokeWidth="16" fill="transparent" strokeDasharray="565" strokeDashoffset={565 - (565 * 72) / 100} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute text-center">
              <p className="text-5xl font-black text-gray-800">72%</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">On track</p>
            </div>
          </div>
          <div className="grid grid-cols-3 w-full mt-10 pt-8 border-t border-gray-50 text-center">
            <div><p className="text-xl font-bold text-gray-800">43</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Done</p></div>
            <div><p className="text-xl font-bold text-gray-800">12</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Active</p></div>
            <div><p className="text-xl font-bold text-gray-800">5</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Left</p></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col hover:border-indigo-100 transition-colors">
          <div className="w-full flex justify-between items-center mb-10">
            <h4 className="font-bold text-gray-800 text-sm">Course performance</h4>
            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <button className="text-[9px] px-3 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Week</button>
              <button className="text-[9px] px-3 py-1.5 bg-white shadow-sm rounded-lg font-bold text-gray-800 uppercase tracking-tighter border border-gray-100">Month</button>
              <button className="text-[9px] px-3 py-1.5 font-bold text-gray-400 uppercase tracking-tighter">Term</button>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 px-4">
            {[45, 85, 55, 65, 80, 50, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-50/30 rounded-t-xl relative group h-[180px]">
                <div className="absolute bottom-0 w-full bg-[#7B61FF] rounded-t-xl transition-all duration-700 group-hover:bg-indigo-600" style={{ height: `${h}%` }} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}%</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-4 text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">
            <span>UI/UX</span><span>Data</span><span>Web</span><span>Mkt</span><span>Prod</span><span>AI</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM TASKS & WEEKLY STUDY ROW - POLISHED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-gray-800 text-sm">Upcoming tasks</h4>
            <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {[
              { task: "UX Research Paper", sub: "UI/UX Design • Due Today, 11:59 PM", status: "Due today", color: "text-red-500 bg-red-50 border-red-100" },
              { task: "Python Quiz - Pandas", sub: "Data Science • Due Tomorrow", status: "Pending", color: "text-amber-500 bg-amber-50 border-amber-100" },
              { task: "Marketing Funnel Worksheet", sub: "Growth Marketing • Due Apr 27", status: "Pending", color: "text-amber-500 bg-amber-50 border-amber-100" },
              { task: "ML Model Submission", sub: "Intro to ML • Due Apr 29", status: "Pending", color: "text-amber-500 bg-amber-50 border-amber-100" },
            ].map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <BookOpen size={20}/>
                   </div>
                   <div>
                      <h5 className="text-sm font-bold text-gray-800">{t.task}</h5>
                      <p className="text-[11px] text-gray-400 font-medium">{t.sub}</p>
                   </div>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase border ${t.color}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-colors">
           <div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Weekly study</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-8">Hours spent learning</p>
           </div>
           
           <div className="flex-1 flex items-end justify-between gap-4 px-6 h-32">
              {[30, 40, 90, 45, 60, 50, 40].map((h, i) => (
                <div key={i} className="w-3 bg-indigo-50/50 rounded-full relative h-full group">
                   <div className="absolute bottom-0 w-full bg-[#7B61FF] rounded-full transition-all duration-1000 group-hover:bg-indigo-600" style={{ height: `${h}%` }} />
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">{(h/10).toFixed(1)}h</div>
                </div>
              ))}
           </div>

           <div className="flex justify-between mt-6 px-4 text-[10px] text-gray-400 font-extrabold uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>

           <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
              <div>
                 <p className="text-3xl font-black text-gray-800 tracking-tight">18.4 h</p>
                 <p className="text-[10px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1">
                   <span className="text-xs">↑</span> +12% vs last week
                 </p>
              </div>
              <div className="px-5 py-2.5 bg-green-50 text-green-600 rounded-2xl text-[10px] font-bold uppercase flex items-center gap-2 border border-green-100">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 On goal
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}