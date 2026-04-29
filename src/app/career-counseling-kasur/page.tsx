"use client";

import Script from "next/script";
import Header from "@/components/Header";
import CareerCounselingBookingForm from "@/components/CareerCounselingBookingForm";

export default function CareerCounselingPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Career Counseling in Kasur",
    provider: {
      "@type": "Organization",
      name: "TECHZOQ",
      url: "https://techzoq.com",
    },
    areaServed: {
      "@type": "City",
      name: "Kasur",
    },
    serviceType: "Career counseling and course guidance",
    url: "https://techzoq.com/career-counseling-kasur",
    description:
      "Guided career counseling by TECHZOQ for students confused about course direction, skills, and future opportunities.",
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans selection:bg-[#00D1B2]/30">
      <Script
        id="career-counseling-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main id="main">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-[#00D1B2]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-[#004a80]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">

              {/* Left Content Area */}
              <div className="text-left space-y-8">

                {/* MODERN BADGE (UPDATED) */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-white to-[#f0f9ff] border border-[#00D1B2]/20 shadow-[0_4px_20px_rgba(0,209,178,0.08)] transition-all hover:shadow-[0_4px_25px_rgba(0,209,178,0.15)] hover:-translate-y-0.5 cursor-default group">
                  <span className="text-lg animate-pulse group-hover:scale-110 transition-transform">✨</span>
                  <span className="text-[11px] font-black tracking-[0.15em] uppercase">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1B2] to-[#004a80]">
                      Career Counseling Program
                    </span>
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-slate-950 leading-[1.05] tracking-tight">
                  Get Clarity for <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1B2] via-[#004a80] to-[#004a80]">Your Future</span>
                </h1>

                <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                  Confused about your career path? Get expert guidance from TECHZOQ&apos;s industry professionals and build a roadmap that works.
                </p>

                <div className="flex flex-wrap gap-5">
                  <a href="#booking" className="px-10 py-5 rounded-2xl bg-[#004a80] text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(0,74,128,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,74,128,0.4)] transition-all hover:-translate-y-1">
                    Book a Session
                  </a>
                  <button className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:border-[#00D1B2] hover:text-[#00D1B2] transition-all">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Right Side: Modern Image Card */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#00D1B2]/15 to-[#004a80]/5 rounded-[4rem] blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/20 backdrop-blur-md p-2 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)]">
                  <div className="overflow-hidden rounded-[2.6rem]">
                    <img
                      src="/images/portfolio/hero-section.png"
                      alt="Mentorship"
                      className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-4 animate-bounce">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00D1B2] to-[#004a80] rounded-xl flex items-center justify-center text-white text-lg shadow-lg">🚀</div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Success Rate</p>
                    <p className="text-sm font-black text-slate-900 leading-none">100% Growth</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MENTORS SECTION */}
        <section className="py-24 bg-[#f8fbff]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-[#004a80] tracking-tighter uppercase">
                Meet Your <span className="text-[#00D1B2]">Mentors</span>
              </h2>
              <div className="h-1.5 w-20 bg-gradient-to-r from-[#00D1B2] to-[#004a80] mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Bilal",
                  role: "Software Engineer & Architect",
                  image: "/images/portfolio/bilal-monitor.png",
                  skills: "Node.js, AWS, NestJS"
                },
                {
                  name: "Industry Expert",
                  role: "Career Strategist",
                  image: "/images/portfolio/ai-monitor.png",
                  skills: "UI/UX, SaaS Growth"
                },
                {
                  name: "Tech Consultant",
                  role: "AI Specialist",
                  image: "/images/portfolio/innovator-monitor.png",
                  skills: "Python, AI, ERP Systems"
                },
              ].map((mentor, idx) => (
                <div key={idx} className="group relative bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-64 w-full mb-6 overflow-hidden rounded-[2rem] bg-slate-100">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{mentor.name}</h3>
                  <p className="text-[#00D1B2] font-bold text-sm mb-4 uppercase tracking-wider">{mentor.role}</p>
                  <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                    {mentor.skills.split(", ").map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3.5 py-1.5 bg-gradient-to-br from-[#00D1B2]/10 to-[#004a80]/5 text-[#004a80] text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#00D1B2]/20 shadow-sm transition-all hover:border-[#00D1B2] hover:bg-white hover:shadow-md cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING SECTION */}
        <section id="booking" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* FORM CARD - Simple double text removed */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
                {/* Double text is removed from here to let the component handle it */}
                <CareerCounselingBookingForm landingPage="/career-counseling-kasur" />
              </div>

              {/* WHY CHOOSE US SIDE */}
              <div className="space-y-10 lg:pt-10">
                <h2 className="text-4xl font-black text-[#004a80] tracking-tight uppercase">
                  Why Choose <span className="text-[#00D1B2]">Us?</span>
                </h2>
                <div className="grid gap-6">
                  {[
                    { title: "Interest Mapping", desc: "Find the field that fits your passion", icon: "🎯", color: "bg-[#004a80]/5 text-[#004a80]" },
                    { title: "Expert Roadmap", desc: "Customized digital roadmap for your goals", icon: "🗺️", color: "bg-[#00D1B2]/10 text-[#00D1B2]" },
                    { title: "Industry Secrets", desc: "Learn what skills are actually in demand", icon: "💎", color: "bg-[#004a80]/5 text-[#004a80]" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-[#00D1B2]/30 hover:shadow-xl transition-all group">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-colors group-hover:bg-[#00D1B2] group-hover:text-white ${item.color}`}>{item.icon}</div>
                      <div>
                        <h4 className="text-lg font-black text-[#004a80] mb-1">{item.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-[#f8fbff] relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#004a80] tracking-tighter uppercase">
                Common <span className="text-[#00D1B2]">Questions</span>
              </h2>
              <div className="mt-6 h-2 w-16 bg-gradient-to-r from-[#00D1B2] to-[#004a80] mx-auto rounded-full" />
            </div>
            <div className="grid gap-6">
              {[
                { q: "Is the session online or physical?", a: "We offer both online Zoom sessions and physical counseling at our Kasur office." },
                { q: "Will I get a roadmap after the session?", a: "Yes, every student receives a customized digital roadmap." },
                { q: "What fields do you cover?", a: "We specialize in Web Development, AI, Cloud Computing, and SaaS architecture." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-[2.5rem] border border-slate-200/40 bg-white/60 backdrop-blur-md p-2 shadow-sm transition-all duration-500 open:bg-white open:shadow-xl">
                  <summary className="flex items-center justify-between font-bold text-slate-900 list-none p-6 cursor-pointer text-lg md:text-xl tracking-tight">
                    <span className="group-hover:text-[#00D1B2] transition-colors">{faq.q}</span>
                    <div className="relative flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-slate-50 transition-all group-open:bg-[#00D1B2] group-open:rotate-45">
                      <span className="text-xl group-open:text-white">+</span>
                    </div>
                  </summary>
                  <div className="px-8 pb-8 text-slate-600 leading-relaxed font-medium text-lg border-t border-slate-100/50 pt-6 mt-2">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}