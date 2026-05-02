"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CareerCounselingBookingForm from "@/components/CareerCounselingBookingForm";

export default function CareerCounselingSection() {
  return (
    <section className="py-20 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
            Career Counseling
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-slate-950">
            Confused about your career? Don&apos;t guess — get guided.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Book a counseling session with TECHZOQ and get direct guidance on
            career direction, course selection, skill roadmap, and next steps.
          </p>
          <div className="mt-6">
            <Link
              href="/career-counseling-kasur"
              className="text-sky-700 font-semibold hover:text-sky-800"
            >
              Explore the full counseling page
            </Link>
          </div>
        </motion.div>

        <div className="mt-10">
          <CareerCounselingBookingForm
            landingPage="/"
            compact
            title="Book your counseling session"
            subtitle="Simple booking, quick response, and direct counselor follow-up."
          />
        </div>
      </div>
    </section>
  );
}
