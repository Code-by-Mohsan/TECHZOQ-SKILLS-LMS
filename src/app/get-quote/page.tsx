"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  HeadphonesIcon,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import ServiceIcon from "@/components/services/ServiceIcon";
import { SERVICE_ENTRIES } from "@/lib/content/services";

const BUDGET_OPTIONS = [
  { id: "under-5k", label: "Under $5K", desc: "Small scoped build or MVP" },
  { id: "5k-15k", label: "$5K - $15K", desc: "Focused product or module" },
  { id: "15k-50k", label: "$15K - $50K", desc: "Larger business platform" },
  { id: "50k-plus", label: "$50K+", desc: "Enterprise or long-term rollout" },
  { id: "not-sure", label: "Not sure yet", desc: "Need guidance on scope" },
] as const;

const TIMELINE_OPTIONS = [
  { id: "asap", label: "ASAP", desc: "Urgent delivery needed" },
  { id: "1-3-months", label: "1-3 Months", desc: "Standard execution window" },
  { id: "3-6-months", label: "3-6 Months", desc: "Planned delivery" },
  { id: "6-plus", label: "6+ Months", desc: "Longer implementation track" },
  { id: "exploring", label: "Just exploring", desc: "Early-stage planning" },
] as const;

const STEPS = [
  { id: 1, label: "Select Services", helper: "Choose what you need" },
  { id: 2, label: "Project Context", helper: "Budget and scope" },
  { id: 3, label: "Contact Details", helper: "How we reach you" },
] as const;

const PROCESS_STEPS = [
  {
    title: "Share your requirements",
    desc: "Tell us what you need and where the project stands right now.",
  },
  {
    title: "We review and respond",
    desc: "The TECHZOQ team checks fit, scope, and delivery direction.",
  },
  {
    title: "You get a tailored proposal",
    desc: "We send back a practical path with timeline, scope, and next steps.",
  },
] as const;

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Your request stays private and secure" },
  { icon: Zap, text: "Initial response target within 24 hours" },
  { icon: HeadphonesIcon, text: "Free consultation before commitment" },
] as const;

const TESTIMONIAL = {
  quote:
    "TECHZOQ understood our business process quickly and translated it into a clean technical roadmap. The clarity of communication made the difference.",
  name: "Aisha K.",
  role: "CTO, Fintech Startup",
};

export default function GetQuotePage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formLoadedAt = useRef(Date.now());
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const selectedServiceEntries = useMemo(
    () => SERVICE_ENTRIES.filter((service) => selectedServices.includes(service.slug)),
    [selectedServices],
  );

  const budgetLabel = useMemo(
    () => BUDGET_OPTIONS.find((item) => item.id === budget)?.label || "Not selected",
    [budget],
  );
  const timelineLabel = useMemo(
    () => TIMELINE_OPTIONS.find((item) => item.id === timeline)?.label || "Not selected",
    [timeline],
  );

  const toggleService = (slug: string) => {
    setSelectedServices((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^[\d\s+\-()]{7,20}$/.test(value.trim());

  const canProceed = useCallback(() => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return true;
    if (step === 3) return Boolean(name.trim() && email.trim() && phone.trim());
    return false;
  }, [step, selectedServices.length, name, email, phone]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Name, email, and phone number are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const now = Date.now();
    if (now - lastSubmitRef.current < 10_000) {
      setError("Please wait a few seconds before submitting again.");
      return;
    }
    lastSubmitRef.current = now;

    setSubmitting(true);
    setError("");

    const messageParts = [
      `Services: ${selectedServiceEntries.map((service) => service.title).join(", ") || "Not specified"}`,
      budget ? `Budget: ${budgetLabel}` : "",
      timeline ? `Timeline: ${timelineLabel}` : "",
      projectDetails.trim() ? `Details: ${projectDetails.trim()}` : "",
      company.trim() ? `Company: ${company.trim()}` : "",
    ].filter(Boolean);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: messageParts.join("\n"),
          type: "general",
          source: "website",
          campaign: "quote_request",
          landingPage: "/get-quote",
          company: company.trim(),
          _hp_website: honeypot,
          _formLoadedAt: formLoadedAt.current,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError("Too many requests. Please wait a minute and try again.");
        return;
      }

      if (!response.ok) {
        if (response.status === 409) {
          setError("We already have your inquiry on file. Our team will reach out to you soon.");
        } else {
          setError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <section className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 pb-16 pt-28">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(16,185,129,0.08)] sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-8 text-3xl font-black text-slate-950 sm:text-4xl">
              Quote request received
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Your inquiry has been submitted successfully. The TECHZOQ team will review your requirements and respond within 24 hours.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Confirmation will be sent to <span className="font-medium text-slate-700">{email}</span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Explore services
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#f8fafc_100%)] text-slate-950">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Free consultation and quote
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Tell TECHZOQ what you need. We&apos;ll turn it into a practical proposal.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Use this form to share your project needs, budget context, and timeline. The page is structured to make the request easy to complete without forcing unnecessary fields up front.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {PROCESS_STEPS.map((item, index) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
                  Step {index + 1}
                </div>
                <h2 className="mt-3 text-xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  {STEPS.map((item, index) => {
                    const isCurrent = item.id === step;
                    const isDone = item.id < step;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.id < step) {
                              setError("");
                              setStep(item.id);
                            }
                          }}
                          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                            isCurrent
                              ? "border border-sky-200 bg-sky-50 text-slate-950"
                              : isDone
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                              isDone
                                ? "bg-emerald-600 text-white"
                                : isCurrent
                                  ? "bg-slate-950 text-white"
                                  : "bg-white text-slate-500"
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : item.id}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{item.label}</span>
                            <span className="block text-xs text-slate-500">{item.helper}</span>
                          </span>
                        </button>
                        {index < STEPS.length - 1 && <div className="hidden h-px w-8 bg-slate-200 sm:block" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (step < 3) {
                    setError("");
                    setStep(step + 1);
                    return;
                  }
                  void handleSubmit();
                }}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute -z-50 overflow-hidden opacity-0 pointer-events-none"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  <label htmlFor="hp_website">Website</label>
                  <input
                    id="hp_website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="services"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-black text-slate-950">
                        Select the services you need
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Choose one or more services. This step is required so we can route your request correctly.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {SERVICE_ENTRIES.map((service) => {
                          const selected = selectedServices.includes(service.slug);
                          return (
                            <button
                              key={service.slug}
                              type="button"
                              onClick={() => toggleService(service.slug)}
                              className={`flex items-start gap-4 rounded-[1.5rem] border p-4 text-left transition ${
                                selected
                                  ? "border-sky-300 bg-sky-50 shadow-sm"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`rounded-2xl p-3 ${selected ? "bg-white text-sky-700" : "bg-slate-50 text-slate-600"}`}>
                                <ServiceIcon icon={service.icon} className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-sm font-semibold text-slate-950">{service.title}</h3>
                                  {selected && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />}
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.teaser}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-black text-slate-950">
                        Add project context
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        These details help us shape a more useful proposal, but nothing here is mandatory.
                      </p>

                      <div className="mt-6 space-y-6">
                        <div>
                          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <DollarSign className="h-4 w-4 text-slate-500" />
                            Estimated budget
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {BUDGET_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setBudget(option.id)}
                                className={`rounded-[1.25rem] border p-4 text-left transition ${
                                  budget === option.id
                                    ? "border-sky-300 bg-sky-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <div className="text-sm font-semibold text-slate-950">{option.label}</div>
                                <div className="mt-1 text-xs text-slate-500">{option.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Clock className="h-4 w-4 text-slate-500" />
                            Expected timeline
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {TIMELINE_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setTimeline(option.id)}
                                className={`rounded-[1.25rem] border p-4 text-left transition ${
                                  timeline === option.id
                                    ? "border-sky-300 bg-sky-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <div className="text-sm font-semibold text-slate-950">{option.label}</div>
                                <div className="mt-1 text-xs text-slate-500">{option.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <MessageSquare className="h-4 w-4 text-slate-500" />
                            Project description
                            <span className="font-normal text-slate-500">optional</span>
                          </label>
                          <textarea
                            value={projectDetails}
                            onChange={(event) => setProjectDetails(event.target.value)}
                            rows={5}
                            placeholder="Describe the problem, required features, audience, or current business workflow."
                            className="w-full rounded-[1.5rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-black text-slate-950">
                        Add your contact details
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        We need a valid name, email, and phone number so we can send the proposal and follow up if needed.
                      </p>

                      <div className="mt-6 grid gap-5">
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <User className="h-4 w-4 text-slate-500" />
                            Full name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full rounded-[1.25rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Mail className="h-4 w-4 text-slate-500" />
                            Email address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="john@company.com"
                            required
                            className="w-full rounded-[1.25rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Phone className="h-4 w-4 text-slate-500" />
                            Phone number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="+92 300 0000000"
                            required
                            className="w-full rounded-[1.25rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Briefcase className="h-4 w-4 text-slate-500" />
                            Company or organization
                          </label>
                          <input
                            type="text"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                            placeholder="Your company or institute"
                            className="w-full rounded-[1.25rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep(step - 1);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    disabled={!canProceed() || submitting}
                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                      !canProceed() || submitting
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : step === 3
                          ? "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-900"
                          : "bg-sky-600 text-white hover:-translate-y-0.5 hover:bg-sky-700"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : step === 3 ? (
                      <>
                        <Send className="h-4 w-4" />
                        Submit request
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-5 lg:sticky lg:top-28"
            >
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
                  Live summary
                </h3>
                <div className="mt-5 space-y-5">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Services
                    </div>
                    {selectedServiceEntries.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedServiceEntries.map((service) => (
                          <span
                            key={service.slug}
                            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                          >
                            {service.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No services selected yet.</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Budget
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">{budgetLabel}</p>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Timeline
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">{timelineLabel}</p>
                    </div>
                  </div>

                  {(name || email) && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Contact
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-slate-700">
                        {name && <p className="font-medium text-slate-900">{name}</p>}
                        {email && <p>{email}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
                  Why this page works
                </h3>
                <div className="mt-5 space-y-4">
                  {TRUST_POINTS.map((point) => (
                    <div key={point.text} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                        <point.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm leading-relaxed text-slate-700">{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  &ldquo;{TESTIMONIAL.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <div className="text-sm font-semibold text-slate-950">{TESTIMONIAL.name}</div>
                  <div className="text-xs text-slate-500">{TESTIMONIAL.role}</div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
                  Prefer direct contact?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If you already know what you need, contact TECHZOQ directly and reference your project idea.
                </p>
                <div className="mt-5 space-y-3">
                  <a
                    href="mailto:support@techzoq.com"
                    className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-800"
                  >
                    <Mail className="h-4 w-4" />
                    support@techzoq.com
                  </a>
                  <a
                    href="tel:+923231001246"
                    className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-800"
                  >
                    <Phone className="h-4 w-4" />
                    +92 323 1001246
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
