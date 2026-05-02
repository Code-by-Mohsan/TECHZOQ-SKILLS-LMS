"use client";

import React from "react";

export default function Settings() {
  const sections = [
    {
      title: "Notifications",
      desc: "Choose what you want to be notified about",
      options: [
        { label: "New assignments", enabled: true },
        { label: "Course announcements", enabled: false },
        { label: "Fee reminders", enabled: true },
        { label: "Weekly progress digest", enabled: false },
      ],
    },
    {
      title: "Appearance",
      desc: "Customize your interface",
      options: [
        { label: "Theme", enabled: true },
        { label: "Reduce motion", enabled: false },
        { label: "Compact mode", enabled: true },
        { label: "Sidebar density", enabled: false },
      ],
    },
    {
      title: "Language & Region",
      desc: "Set your preferred language and time zone",
      options: [
        { label: "Language", enabled: true },
        { label: "Time zone", enabled: false },
        { label: "Date format", enabled: true },
        { label: "Number format", enabled: false },
      ],
    },
    {
      title: "Privacy",
      desc: "Control your data and visibility",
      options: [
        { label: "Profile visibility", enabled: true },
        { label: "Data sharing", enabled: false },
        { label: "Activity status", enabled: true },
        { label: "Download my data", enabled: false },
      ],
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900">Settings</h2>
        <p className="text-[11px] text-gray-400 font-bold mt-1">
          Personalize Lumen to fit how you learn best.
        </p>
      </div>

      {/* SETTINGS CARDS */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-gray-100 rounded-[32px] p-10 flex flex-col md:flex-row gap-10 md:gap-20 shadow-sm"
          >
            {/* Left Side: Title & Description */}
            <div className="md:w-1/3">
              <h4 className="text-[14px] font-black text-gray-800 mb-2">{section.title}</h4>
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                {section.desc}
              </p>
            </div>

            {/* Right Side: Options List */}
            <div className="flex-1 space-y-6">
              {section.options.map((opt, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="text-[13px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
                    {opt.label}
                  </span>
                  
                  {/* Custom Toggle Switch (Same as Figma) */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={opt.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B61FF]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}