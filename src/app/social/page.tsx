"use client";

import Image from "next/image";
import { MapPin, Globe, Linkedin, Facebook, MessageCircle } from "lucide-react";
import "./social.css";

const socialLinks = [
   {
    name: "Location",
    url: "https://maps.app.goo.gl/dJvdfc1hhsKRaStCA",
    icon: MapPin,
    color: "from-red-500 to-pink-600",
    hoverColor: "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
  },
   {
    name: "WhatsApp",
    url: "https://wa.me/923231001246",
    icon: MessageCircle,
    color: "from-[#25D366] to-[#20B954]",
    hoverColor: "hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/techzoq",
    icon: Linkedin,
    color: "from-[#0077B5] to-[#00A0DC]",
    hoverColor: "hover:shadow-[0_0_30px_rgba(0,119,181,0.4)]",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/techzoq",
    icon: Facebook,
    color: "from-[#1877F2] to-[#4A90E2]",
    hoverColor: "hover:shadow-[0_0_30px_rgba(24,119,242,0.4)]",
  },
 
  {
    name: "Website",
    url: "https://techzoq.com",
    icon: Globe,
    color: "from-purple-600 to-indigo-600",
    hoverColor: "hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]",
  },

];

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Matrix-style background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[120px] -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] top-1/4 right-0 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] bottom-1/4 -left-48 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Scanning line effect */}
        <div className="scanning-line"></div>
      </div>

      <div className="social-container">
        {/* Profile Card */}
        <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,255,0.3)] border border-cyan-500/30 mb-8 overflow-hidden">
          {/* Shimmer effect */}
          <div className="shimmer-effect"></div>

          {/* Hexagon pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300ffff' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>

          {/* Profile Image/Logo + Info */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            {/* <Image
              src="/logo-svg.svg"
              alt="TechZoq Logo"
              width={110}
              height={110}
              className="drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
            /> */}

            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                TECHZOQ
              </h1>
              <p className="text-cyan-300/70 text-xs font-light tracking-widest uppercase mt-1">
                ⚡ Your Technology &amp; Education Partner ⚡
              </p>
            </div>

            {/* "Find us on" divider */}
            <div className="flex items-center gap-3 w-full mt-1">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/40"></div>
              <span className="text-cyan-400/80 text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
                Find us on
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/40"></div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-card group"
              >
                {/* Animated border shimmer */}
                <div className="card-shimmer"></div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      relative w-14 h-14 rounded-xl
                      bg-gradient-to-br ${link.color}
                      flex items-center justify-center
                      shadow-[0_0_20px_rgba(0,255,255,0.3)]
                      group-hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]
                      group-hover:scale-110 transition-all duration-300
                      border border-white/20
                      overflow-hidden
                    `}
                    >
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <Icon className="w-7 h-7 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg tracking-wide drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                        {link.name}
                      </span>
                      <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-500"></div>
                    </div>
                  </div>

                  {/* Futuristic arrow */}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                    <svg
                      className="w-6 h-6 text-cyan-400/60 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-block relative">
            <p className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-sm font-medium tracking-wider">
              © {new Date().getFullYear()} TechZoq. All rights reserved.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
