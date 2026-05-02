"use client";

import { CreditCard, CheckCircle2, AlertCircle, Calendar, Percent, ArrowRight, Download, Eye } from "lucide-react";

export default function FeeManagement() {
  const summaryStats = [
    { label: "Total Fee", val: "20,000", sub: "Academic Year 2026", icon: <CreditCard size={16} className="text-indigo-500" />, bg: "bg-indigo-50" },
    { label: "Paid Amount", val: "5,000", sub: "57.7% complete", icon: <CheckCircle2 size={16} className="text-green-500" />, bg: "bg-green-50" },
    { label: "Due Amount", val: "Rs 13,000", sub: "2 installments left", icon: <AlertCircle size={16} className="text-red-500" />, bg: "bg-red-50" },
    { label: "Next Due Date", val: "May 12", sub: "in 18 days", icon: <Calendar size={16} className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Discount", val: "20%", sub: "Eid Offer", icon: <Percent size={16} className="text-amber-500" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Fee Overview</h2>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
            Spring Semester 2025 • Account #SU-220481
          </p>
        </div>
        <button className="bg-[#7B61FF] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all">
          Pay now <ArrowRight size={16} />
        </button>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryStats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${s.bg} rounded-xl`}>{s.icon}</div>
            </div>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">{s.label}</p>
            <h4 className="text-lg font-black text-gray-800">{s.val}</h4>
            <p className="text-[9px] text-gray-400 font-bold mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION: PROGRESS & UPCOMING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Progress Circle */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center">
          <h4 className="w-full text-xs font-black text-gray-800 uppercase tracking-widest mb-8">Payment progress</h4>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#F8FAFC" strokeWidth="16" fill="transparent" />
              <circle cx="96" cy="96" r="80" stroke="#7B61FF" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset={502 - (502 * 58) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <p className="text-4xl font-black text-gray-800">58%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">paid</p>
            </div>
          </div>
          <div className="flex justify-between w-full mt-8">
            <div className="text-center">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Paid</p>
              <p className="text-xs font-black text-gray-800">5,000</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Remaining</p>
              <p className="text-xs font-black text-gray-800">Rs 13,000</p>
            </div>
          </div>
        </div>

        {/* Upcoming Installment Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#7B61FF] to-[#9D88FF] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Upcoming Installment</p>
                <h3 className="text-2xl font-black">Spring • Installment 4 of 5</h3>
                <p className="text-[11px] font-medium opacity-80 mt-2">Auto-reminder will be sent 3 days before due date.</p>
              </div>
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-bold uppercase">Due in Day 18</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Due date</p>
                  <p className="text-base font-bold">May 12, 2025</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Amount</p>
                  <p className="text-base font-bold">Rs 5,000</p>
                </div>
              </div>
              <button className="bg-white text-[#7B61FF] px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-gray-50 transition-all">
                Pay Now <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Installment History Lineup */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Inst. 1", amount: "Rs 6,000", status: "Paid", color: "text-green-500", bg: "bg-green-50" },
              { label: "Inst. 2", amount: "Rs 6,000", status: "Paid", color: "text-green-500", bg: "bg-green-50" },
              { label: "Inst. 4", amount: "Rs 6,000", status: "Due", color: "text-red-500", bg: "bg-red-50" },
              { label: "Inst. 5", amount: "Rs 6,000", status: "Upcoming", color: "text-gray-400", bg: "bg-gray-50" },
            ].map((inst, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl text-center shadow-sm">
                <p className="text-[9px] font-bold text-gray-400 mb-1">{inst.label}</p>
                <p className="text-[10px] font-black text-gray-800 mb-2">{inst.amount}</p>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${inst.bg} ${inst.color}`}>
                  {inst.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <h4 className="text-sm font-black text-gray-800">Recent transactions</h4>
          <button className="text-[10px] font-black text-[#7B61FF] uppercase hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: "INV-2041", date: "Apr 10, 2026", desc: "Installment 1", amount: "Rs 6,000", status: "Paid" },
                { id: "INV-2032", date: "May 10, 2026", desc: "Installment 2", amount: "Rs 6,000", status: "Paid" },
                { id: "INV-2024", date: "Jul 10, 2026", desc: "Installment 3", amount: "Rs 6,000", status: "Paid" },
                { id: "INV-2056", date: "May 12, 2025", desc: "Installment 5", amount: "Rs 6,000", status: "Pending" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 text-xs font-bold text-gray-800">{row.id}</td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-500">{row.date}</td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-600">{row.desc}</td>
                  <td className="px-8 py-5 text-xs font-black text-gray-800 text-right">{row.amount}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      row.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 text-indigo-500">
                      <button className="hover:scale-110 transition-transform"><Download size={14} /></button>
                      <button className="hover:scale-110 transition-transform font-bold flex items-center gap-1 text-[10px]">
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}