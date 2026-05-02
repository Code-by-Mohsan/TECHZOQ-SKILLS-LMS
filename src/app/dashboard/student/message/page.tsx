"use client";

import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";

export default function Messages() {
  const chats = [
    { id: 1, name: "Ali Ahmed", msg: "Great progress on the wireframes!", time: "2m", unread: 2, active: true },
    { id: 2, name: "Ali Ahmed", msg: "Great progress on the wireframes!", time: "2m", unread: 2, active: false },
    { id: 3, name: "Ali Ahmed", msg: "Great progress on the wireframes!", time: "2m", unread: 2, active: false },
    { id: 4, name: "Ali Ahmed", msg: "Great progress on the wireframes!", time: "2m", unread: 2, active: false },
  ];

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex gap-6">
      
      {/* LEFT SIDE: CHAT LIST */}
      <div className="w-full max-w-[380px] bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="search conversation" 
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className={`flex items-center gap-4 p-4 rounded-[24px] cursor-pointer transition-all ${chat.active ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#7B61FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AA
                </div>
                {chat.active && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-sm font-bold text-gray-800 truncate">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
                </div>
                <p className="text-[11px] text-gray-400 truncate font-medium">{chat.msg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-[#7B61FF] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: CONVERSATION AREA */}
      <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7B61FF] rounded-full flex items-center justify-center text-white font-bold">
              AM
            </div>
            <div>
              <h4 className="text-base font-black text-gray-800">Ali Ahmed</h4>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online • UI/UX Instructor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"><Phone size={18}/></button>
             <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"><Video size={18}/></button>
             <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"><MoreVertical size={18}/></button>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/20">
          
          {/* Receiver Message */}
          <div className="flex items-end gap-3 max-w-[70%]">
            <div className="w-8 h-8 bg-[#7B61FF] rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
              AM
            </div>
            <div className="bg-[#7B61FF] text-white p-4 rounded-2xl rounded-bl-none shadow-sm">
              <p className="text-sm font-medium leading-relaxed">Hey, How are you?</p>
            </div>
          </div>

          {/* Sender Message */}
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-[#7B61FF] text-white p-6 rounded-3xl rounded-br-none shadow-lg shadow-indigo-100">
              <p className="text-sm font-medium leading-relaxed">
                I was asking for your New Year Plans, ask we are going to host a party.
              </p>
            </div>
          </div>

        </div>

        {/* Message Input */}
        <div className="p-6 bg-white border-t border-gray-50">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 pl-4">
            <input 
              type="text" 
              placeholder="Type your message here..." 
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-600 placeholder:text-gray-400"
            />
            <button className="bg-[#7B61FF] text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-md shadow-indigo-100">
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}