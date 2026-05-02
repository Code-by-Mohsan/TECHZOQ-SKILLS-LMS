"use client";

import { Mail, Phone, MapPin, Calendar, Edit3, Award, Settings, Shield, Bell, Lock, Link2, ChevronRight } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto pt-6 px-8">
        
        {/* --- THE REAL HERO SECTION --- */}
        <div className="relative mb-32">
          {/* Banner with exact Figma Gradient */}
          <div className="w-full h-52 bg-gradient-to-r from-[#816AFF] to-[#AE9DFF] rounded-[32px]" />
          
          {/* Avatar: Exact Squircle Overlap */}
          <div className="absolute -bottom-14 left-10 flex items-end gap-6">
            <div className="w-36 h-36 bg-[#7B61FF] border-[8px] border-white rounded-[42px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100/40">
              Am
            </div>
            
            {/* User Branding */}
            <div className="pb-4">
              <div className="flex items-center gap-6">
                <h2 className="text-[28px] font-black text-gray-900 tracking-tight">ALI MOEZ</h2>
                <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-transparent hover:border-gray-300 transition-all pb-0.5">
                  <Edit3 size={12} /> Edit profile
                </button>
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                UIUX Design • ID: SU-22-0481
              </p>
            </div>
          </div>
        </div>

        {/* --- CONTACT ROW --- */}
        <div className="flex gap-12 px-4 mb-16 border-b border-gray-50 pb-10">
          {[
            { icon: <Mail size={16} />, text: "alimoez6639@gmail.com" },
            { icon: <Phone size={16} />, text: "+92 300 4501122" },
            { icon: <MapPin size={16} />, text: "Lahore, Pakistan" },
            { icon: <Calendar size={16} />, text: "April 25, 2026" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer">
              <div className="text-[#7B61FF]">{item.icon}</div>
              <span className="text-[12px] font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
          
          {/* Left: Enrolled Courses */}
          <div className="lg:col-span-7">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Enrolled courses</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "UI/UX Design Fundamentals", tutor: "Sara Ahmed", prog: 72 },
                { title: "Data Science with Python", tutor: "Dr. Imran Khan", prog: 45 },
                { title: "Modern Web Development", tutor: "Hassan Ali", prog: 88 },
                { title: "Growth Marketing Essentials", tutor: "Maria Lopez", prog: 30 },
              ].map((c, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-[28px] flex gap-4 items-center hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase">Thumb</div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[13px] font-black text-gray-800 leading-snug">{c.title}</h5>
                    <p className="text-[10px] text-gray-400 font-bold mb-3">{c.tutor}</p>
                    <div className="w-full bg-gray-50 h-1 rounded-full">
                      <div className="bg-[#7B61FF] h-full rounded-full" style={{ width: `${c.prog}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Achievements & Settings */}
          <div className="lg:col-span-5 space-y-16">
            
            {/* Achievements Section */}
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Achievements</h4>
              <div className="grid grid-cols-4 gap-3">
                {["🏆", "🎯", "📚", "🔥", "⭐", "💎", "", ""].map((emoji, i) => (
                  <div key={i} className={`aspect-square rounded-[20px] flex items-center justify-center text-xl ${emoji ? 'bg-indigo-50/50' : 'bg-gray-50/50'}`}>
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 font-black uppercase text-center mt-4">6 unlocked • 4 to go</p>
            </div>

            {/* Account Settings Section */}
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Account settings</h4>
              <div className="space-y-1">
                {[
                  "Personal information",
                  "Password & security",
                  "Email notifications",
                  "Privacy",
                  "Connected apps"
                ].map((item, i) => (
                  <button key={i} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                    <span className="text-[13px] font-bold text-gray-500 group-hover:text-gray-900">{item}</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#7B61FF]" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}