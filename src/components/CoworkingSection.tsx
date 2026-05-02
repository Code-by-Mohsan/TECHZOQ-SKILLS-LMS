"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import CoworkingBookingForm from "./CoworkingBookingForm";
import CoworkingFAQ from "./CoworkingFAQ";

export default function CoworkingSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [1, 2, 3, 4, 5, 6].map((num) => `/co-working/${num}.jpg`);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="space-y-16">
      {/* Hero with Auto-Carousel */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Premium Coworking Space
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Your Workspace,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                Elevated
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Join a thriving community of innovators, entrepreneurs, and
              creators in our modern, professionally designed coworking space.
              High-speed connectivity, ergonomic comfort, and inspiring
              atmosphere—everything you need to do your best work.
            </p>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    High Speed
                  </div>
                  <div className="text-sm text-slate-600">Fiber Internet</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Access</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Private offices, dedicated desks & hot desks
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Fully equipped meeting rooms & event spaces
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Vibrant community events & networking opportunities
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contact"
                className="group relative px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Schedule a Tour</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/apply"
                className="px-8 py-4 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-all duration-300 hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="order-first lg:order-last">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px] lg:h-[500px]">
                {heroImages.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Coworking space view ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? "bg-white w-8"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mini Gallery Preview */}
              <div className="absolute -bottom-6 left-6 right-6 hidden md:grid grid-cols-3 gap-3">
                {[7, 8, 9].map((num) => (
                  <div
                    key={num}
                    className="group relative h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={`/co-working/${num}.jpg`}
                      alt={`Preview ${num}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            value: "500+",
            label: "Community Members",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          },
          {
            value: "98%",
            label: "Satisfaction Rate",
            icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            value: "24/7",
            label: "Workspace Access",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            value: "50+",
            label: "Seats",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amenities with Icons */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            World-Class Amenities
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to be productive, comfortable, and inspired
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "High-Speed Internet",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              desc: "high speed fiber connection",
            },
            {
              title: "Ergonomic Workspace",
              icon: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
              desc: "Height-adjustable desks",
            },
            {
              title: "Meeting Rooms",
              icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
              desc: "Fully equipped with A/V",
            },
            {
              title: "Phone Booths",
              icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
              desc: "Private call spaces",
            },
            {
              title: "Premium Coffee",
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
              desc: "Barista-quality drinks",
            },
            {
              title: "Event Space",
              icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
              desc: "Host workshops & talks",
            },
            {
              title: "24/7 Access",
              icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
              desc: "Work anytime you want",
            },
            {
              title: "Print & Scan",
              icon: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
              desc: "Full office equipment",
            },
          ].map((amenity) => (
            <div
              key={amenity.title}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={amenity.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {amenity.title}
                  </h3>
                  <p className="text-sm text-gray-600">{amenity.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />

        <div className="relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-slate-900">
              Flexible Plans for Every Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From hot desks to private offices, find the perfect workspace
              solution
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                name: "Day Pass",
                price: "Rs. 1,500",
                period: "per day",
                description: "Perfect for visitors and one-off days",
                features: [
                  "Access to common areas",
                  "High-speed Wi-Fi",
                  "Coffee & tea",
                  "Print access",
                ],
                popular: false,
              },
              {
                name: "Hot Desk",
                price: "Rs. 8,500",
                period: "per month",
                description: "Flexible seating in shared workspace",
                features: [
                  "First-come seating",
                  "All day pass benefits",
                  "Community events",
                  "Mail handling",
                ],
                popular: false,
              },
              {
                name: "Dedicated Desk",
                price: "Rs. 12,500",
                period: "per month",
                description: "Your own desk with 24/7 access",
                features: [
                  "Reserved desk & locker",
                  "24/7 access",
                  "Meeting room hours",
                  "Priority support",
                ],
                popular: true,
              },
              {
                name: "Customized Desk",
                price: "From Rs. 15,000",
                period: "per month",
                description: "Secure space for your team",
                features: [
                  "1-10 person",
                  "Lockers",
                  "Meeting room credits",
                  "Priority support",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-6 border ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-500 shadow-2xl scale-105"
                    : "border-blue-200 hover:border-blue-400"
                } transition-all duration-300 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                    {plan.name}
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900 mb-1">
                    {plan.price}
                  </div>
                  <div className="text-sm text-slate-600">{plan.period}</div>
                  <p className="text-sm text-slate-600 mt-3">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors duration-300">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-700 mb-4">
              Need a custom solution for your enterprise?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors duration-300"
            >
              Contact Sales
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Schedule Your Visit
            </h2>
            <p className="text-lg text-slate-600">
              Experience our space firsthand. Book a tour and see why our
              members love working here.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <CoworkingBookingForm />
          </div>
        </div>
      </div>

      {/* Immersive Gallery */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Explore Our Space
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take a visual tour of our beautifully designed workspace
          </p>
        </div>

        {/* Masonry Gallery Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Large featured images */}
          <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
            <img
              src="/co-working/1.jpg"
              alt="Main workspace area"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Main Workspace</h3>
                <p className="text-sm text-white/90">Open collaborative area</p>
              </div>
            </div>
          </div>

          {[10, 11, 12, 13].map((num, idx) => (
            <div
              key={num}
              className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${idx === 1 ? "row-span-2" : ""}`}
            >
              <img
                src={`/co-working/${num}.jpg`}
                alt={`Office view ${num}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            </div>
          ))}

          <div className="col-span-2 group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer">
            <img
              src="/co-working/14.jpg"
              alt="Meeting space"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Meeting Rooms</h3>
              </div>
            </div>
          </div>

          {[15, 16, 17, 18, 19].map((num, idx) => (
            <div
              key={num}
              className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${idx === 2 ? "col-span-2" : ""}`}
            >
              <img
                src={`/co-working/${num}.jpg`}
                alt={`Office detail ${num}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Schedule a Virtual Tour
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold mb-6">
              Why Choose Our Coworking Space?
            </h2>
            <ul className="space-y-4">
              {[
                "Prime location with easy access to public transport",
                "Vibrant community of entrepreneurs and professionals",
                "Regular networking events and skill workshops",
                "Flexible contracts with no long-term commitment",
                "Professional business address for your company",
                "Cost-effective alternative to traditional offices",
              ].map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white/95">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
            Member Testimonials
          </h2>
          <div className="space-y-6">
            {[
              {
                text: "This coworking space has transformed how I work. The community is amazing and the facilities are top-notch!",
                author: "Sarah Johnson",
                role: "Founder, Tech Startup",
              },
              {
                text: "Best decision for my remote team. The meeting rooms and private offices give us flexibility we need.",
                author: "Michael Chen",
                role: "Product Manager",
              },
              {
                text: "Great atmosphere, reliable internet, and excellent coffee. Everything a freelancer needs!",
                author: "Emily Rodriguez",
                role: "Designer & Consultant",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-slate-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Got questions? We've got answers. Learn more about our space and
            membership options.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <CoworkingFAQ />
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-sm">
              ✨ Special Offer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Start Your Free Trial Today
          </h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience our coworking space with a complimentary day pass. No
            commitment required—just come, work, and see if we're the right fit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="group px-8 py-4 bg-white text-primary-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Claim Your Free Day Pass
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us Now
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
