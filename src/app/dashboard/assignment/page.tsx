"use client";

import { Clock, Upload, ChevronDown, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function Assignments() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black text-gray-900">Assignments</h2>
        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">
          Submit your work and track upcoming deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ASSIGNMENT DETAIL & UPLOAD (Takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            
            {/* Top Status Badges */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-bold border border-orange-100">
                <Clock size={14} />
                Due in 6h 24m
              </div>
              <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                Pending
              </span>
            </div>

            {/* Assignment Title */}
            <div className="mb-10">
              <h3 className="text-2xl font-black text-gray-800 mb-2">UX Research Paper · Synthesis</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                UI/UX Design Fundamentals • Module 2
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-12">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Instructions</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                Conduct synthesis on the 5 user interviews provided. Submit a 2nd-page report containing 
                affinity clusters, top 3 insights, and 2 design opportunities. Use the supplied template 
                and cite quotes from the transcripts.
              </p>
            </div>

            {/* Upload Area */}
            <div>
              <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4">Your submission</h4>
              <div className="border-2 border-dashed border-gray-100 rounded-[24px] p-12 flex flex-col items-center justify-center bg-gray-50/30 group hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-[#7B61FF] rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">Drop your file here, or browse</p>
                <p className="text-[10px] text-gray-400 font-bold">PDF, DOCX up to 25 MB</p>
                <button className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 shadow-sm hover:border-indigo-500 transition-colors">
                  Choose File
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex justify-between items-center">
              <button className="text-[11px] font-bold text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-widest">
                Save draft
              </button>
              <button className="bg-[#7B61FF] text-white px-10 py-4 rounded-2xl font-bold text-[12px] shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all transform active:scale-95">
                Submit Assignment
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ALL ASSIGNMENTS LIST (Takes 1/3 space) */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-gray-800 text-sm">All assignments</h4>
            <span className="text-[10px] font-black text-gray-400">4</span>
          </div>

          <div className="space-y-4">
            {[
              { id: 1, title: "UX Research Paper", sub: "UI/UX Design", status: "Pending", time: "Today, 11:59 PM", type: "urgent" },
              { id: 2, title: "UX Research Paper", sub: "UI/UX Design", status: "Submitted", time: "Today, 11:50 PM", type: "success" },
              { id: 3, title: "UX Research Paper", sub: "UI/UX Design", status: "Pending", time: "Today, 11:59 PM", type: "normal" },
              { id: 4, title: "UX Research Paper", sub: "UI/UX Design", status: "Pending", time: "Today, 11:59 PM", type: "normal" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all cursor-pointer group relative">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${item.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-indigo-50 text-[#7B61FF]'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="text-[13px] font-bold text-gray-800">{item.title}</h5>
                      {idx === 0 && <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mb-3">{item.sub}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                        item.type === 'success' ? 'bg-green-100 text-green-600' : 
                        item.type === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold">{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}