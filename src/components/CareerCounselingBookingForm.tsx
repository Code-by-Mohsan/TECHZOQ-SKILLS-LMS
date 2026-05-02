"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type CourseOption = {
  _id: string;
  title: string;
};

type Props = {
  landingPage: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
};

const WHATSAPP_NUMBER = "923231001246";

export default function CareerCounselingBookingForm({
  landingPage,
  compact = false,
  title = "Book a Career Counseling Session",
  subtitle = "Confused about your career? Don't guess — get guided.",
}: Props) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interestCourseId: "",
    preferredDate: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        setCourses(
          (json.data || []).map((course: any) => ({
            _id: course._id,
            title: course.title,
          })),
        );
      })
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: "counseling",
          source: "website",
          campaign: "career_counseling",
          landingPage,
          notes: "Career counseling booking request",
          message: form.message,
          preferredDate: form.preferredDate || undefined,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to book counseling session");
      }

      trackEvent("career_counseling_request", {
        landing_page: landingPage,
        has_course_interest: Boolean(form.interestCourseId),
      });
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        interestCourseId: "",
        preferredDate: "",
        message: "",
      });
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to book counseling session",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Assalam o Alaikum, I want career counseling from TECHZOQ.",
  )}`;

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] ${compact ? "p-6" : "p-8 md:p-12"
        }`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00D1B2]/5 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D1B2]/10 border border-[#00D1B2]/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D1B2] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#00D1B2]">
            Personalized Guidance
          </span>
        </div>

        <h3 className={`${compact ? "text-2xl" : "text-3xl md:text-4xl"} font-black text-slate-900 tracking-tight`}>
          {title}
        </h3>
        <p className="mt-4 text-lg font-medium leading-relaxed text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="relative z-10 mt-10">
        <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
          {/* Form Fields */}
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-[#00D1B2] focus:bg-white focus:ring-4 focus:ring-[#00D1B2]/5 placeholder:text-slate-400 font-medium"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-[#00D1B2] focus:bg-white focus:ring-4 focus:ring-[#00D1B2]/5 placeholder:text-slate-400 font-medium"
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />

          <input
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-[#00D1B2] focus:bg-white focus:ring-4 focus:ring-[#00D1B2]/5 placeholder:text-slate-400 font-medium"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />

          <div className="relative">
            <select
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-[#00D1B2] focus:bg-white focus:ring-4 focus:ring-[#00D1B2]/5 appearance-none cursor-pointer font-medium"
              value={form.interestCourseId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, interestCourseId: event.target.value }))
              }
              disabled={loadingCourses}
            >
              <option value="">Select course interest</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
          </div>

          <div className="md:col-span-2">
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 outline-none transition-all focus:border-[#00D1B2] focus:bg-white focus:ring-4 focus:ring-[#00D1B2]/5 placeholder:text-slate-400 resize-none font-medium"
              rows={compact ? 3 : 4}
              placeholder="Tell us about your goals or confusion..."
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            />
          </div>

          {/* MODERN BUTTONS SECTION */}
          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row pt-4">
            {/* Primary Action Button - Modern Contrast */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex-1 inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-8 py-4.5 font-bold text-white transition-all hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-[#00D1B2]" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Confirm Booking</span>
                  <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Secondary Action Button - Modern WhatsApp Integration */}
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-4.5 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-[#00D1B2]/30 hover:text-[#00D1B2] hover:shadow-lg hover:shadow-[#00D1B2]/5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
              </div>
              WhatsApp
            </Link>
          </div>

          {/* Status Messages */}
          {submitted && (
            <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
              <p className="text-sm font-bold tracking-tight">Booking successful! A counselor will reach out soon.</p>
            </div>
          )}

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-100 bg-red-50/40 p-4 flex items-center gap-3 text-red-800 font-bold text-sm">
              <span className="text-red-500">⚠</span> {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}