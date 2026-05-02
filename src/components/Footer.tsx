"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">

          {/* 1️⃣ Branding / About TECHZOQ */}
          <div className="flex flex-col md:items-start ml-2 space-y-8">
            {/* Bigger Logo */}
            <div className="flex flex-col items-center md:items-start ">
              <Image
                src="/logo.svg"
                alt="TECHZOQ Logo"
                width={160}
                height={160}
                className=" object-contain"
              />
              {/* Tagline below logo */}
              <p className="text-gray-400 text-sm text-center md:text-left">
                Code. Create. Learn. Grow.
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed text-center md:text-left">
              Empower your tech journey<br />
              with hands-on courses, practical<br />
               assessments,and expert <br />
                training at TECHZOQ.
            </p>
          </div>

        {/* 2️⃣ Our Services */}
<div className="px-4">
  <h4 className="text-2xl font-semibold mb-4 text-gray-300 hover:text-primary-700">
    Our Services
  </h4>
  <ul className="space-y-2">
    {["Custom Software", "Web Development", "Mobile Apps", "Cloud Solutions", "AI Fusion Tech"].map(
      (service, idx) => (
        <li
          key={idx}
          className="text-gray-300 hover:text-primary-400 transition-colors duration-300 cursor-pointer flex items-center space-x-2"
        >
          <span className="text-green-500 font-bold text-1xl">{">"}</span>
          <span>{service}</span>
        </li>
      )
    )}
  </ul>
</div>

{/* 3️⃣ Other Services */}
<div className="px-4">
  <h4 className="text-2xl font-semibold mb-4 text-gray-300 hover:text-primary-700">
    Other Services
  </h4>
  <ul className="space-y-2">
    {["Cospace","Software solutions","Service related to software ","Internship on latest technology"].map(
      (item, idx) => (
        <li
          key={idx}
          className="text-gray-300 hover:text-primary-400 transition-colors duration-300 cursor-pointer flex items-center space-x-2"
        >
          <span className="text-green-500 font-bold text-1xl">{">"}</span>
          <span>{item}</span>
        </li>
      )
    )}
  </ul>
</div>

{/* 4️⃣ Contact Us */}
<div className="px-4 pr-4">
  <h4 className="text-2xl font-semibold mb-2 pl-2 text-gray-300 hover:text-primary-700">
    Contact Us
  </h4>
  <ul className="space-y-3">
    {[
      { icon: <MapPin className="w-10 h-10 text-primary-400 mt-1" />, text: "1st Floor, Bypass Road, above Eat and Meet, Kasur" },
      { icon: <Mail className="w-5 h-5 text-primary-400" />, text: "support@techzoq.com" },
      { icon: <Phone className="w-5 h-5 text-primary-400" />, text: "+92 323 1001246", href: "tel:+923231001246" },
      { icon: (
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
        ), text: "Available 24/7 for support"
      }
    ].map((item, idx) => (
      <li
        key={idx}
        className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors duration-300 cursor-pointer"
      >
        <span className="text-green-500 font-bold text-1xl">{">"}</span>
        {item.href ? (
          <a href={item.href} className="flex items-center space-x-2">
            {item.icon}
            <span>{item.text}</span>
          </a>
        ) : (
          <>
            {item.icon}
            <span>{item.text}</span>
          </>
        )}
      </li>
    ))}
  </ul>
</div>


        </div>

        {/* Bottom Bar */}
       <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center px-4 md:px-8">
  <p className="text-sm cursor-pointer text-center md:text-left transition-colors duration-300">
    <span className="text-green-500 hover:text-white transition-colors duration-300">© 2025 TECHZOQ.</span> 
    <span className="text-gray-400 hover:text-white transition-colors duration-300"> All rights reserved. | Code. Create. Learn. Grow.</span>
  </p>
  <div className="flex space-x-2 mt-4 md:mt-0 justify-center md:justify-end">
  {/* Blue text (no hover needed or optional) */}
  <span className="text-blue-500 text-sm font-medium">
    Empowering Tech
  </span>

  {/* Rest text with hover */}
  <span className="text-gray-400 text-sm hover:text-white transition-colors duration-300 cursor-pointer">
    Professionals Worldwide
  </span>
</div>

</div>

      </div>
    </footer>
  );
};

export default Footer;

