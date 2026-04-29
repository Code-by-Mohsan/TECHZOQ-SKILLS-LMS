"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "", email: "", phone: "", company: "",
    subject: "", message: "", inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        trackEvent("contact_form_submit", { inquiry_type: formData.inquiryType });
        setFormData({
          name: "", email: "", phone: "", company: "",
          subject: "", message: "", inquiryType: "general",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: "Visit Us", content: "1st Floor, Bypass Road, Kasur", sub: "above Eat and Meet" },
    { icon: Mail, title: "Email", content: "support@techzoq.com", sub: "24/7 Support" },
    { icon: Phone, title: "Phone", content: "+92 323 1001246", sub: "Mon - Sat" },
    { icon: MessageCircle, title: "WhatsApp", content: "+92 323 1001246", sub: "Instant Reply" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-cyan-100 relative overflow-hidden">
      <Header />

      {/* 1. HERO SECTION (MAX VIDEO VISIBILITY) */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden bg-black z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/images/portfolio/vedio1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-cyan-50/50 z-5" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="inline-block mb-8 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              Get Support Now
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.7)] transition-all">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Touch</span>
            </h1>

            <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed px-4 drop-shadow-md">
              Need help choosing a course or booking a demo? <br className="hidden md:block" />
              Our team is ready to guide your tech journey with expert mentorship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- LOWER CONTENT WITH LIGHT BLUE TINT WRAPPER --- */}
      <div className="relative bg-cyan-50/50 z-0">
        {/* Decorative background glow */}
        <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-cyan-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />

        {/* 2. CONTACT INFO CARDS */}
        <section className="py-20 px-6 relative -mt-10 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  <div className="relative bg-white/90 border border-white/50 backdrop-blur-md p-8 rounded-[2rem] hover:border-cyan-400 hover:shadow-cyan-200 shadow-xl shadow-gray-200/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 border border-cyan-100 shadow-sm shadow-cyan-100">
                      <info.icon className="w-7 h-7 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-950">{info.title}</h3>
                    <p className="text-gray-700 text-sm font-medium mb-2">{info.content}</p>
                    <p className="text-cyan-700 text-xs uppercase tracking-widest font-semibold">{info.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MAIN SECTION */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-start">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-12 order-2 lg:order-1">
                <h2 className="text-4xl md:text-5xl font-black text-gray-950 leading-tight">
                  Let's Help You Choose <br />
                  <span className="text-cyan-600">the Right Path</span>
                </h2>
                <div className="grid gap-4">
                  {[
                    "Course Selection Guidance",
                    "Admissions Support",
                    "Demo Class Booking",
                    "Batch and Fee Information",
                    "Career Path Discussion",
                    "Training & Workshops"
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 p-5 rounded-2xl bg-white/70 border border-white/50 hover:border-cyan-300 hover:bg-white transition-all shadow-sm shadow-cyan-100/50"
                    >
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }} className="w-3 h-3 bg-cyan-600 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <p className="text-gray-800 font-bold">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/10 to-blue-400/5 rounded-[3rem] blur-2xl group-hover:opacity-100 opacity-50 transition duration-1000" />
                <div className="relative bg-white border border-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-cyan-200/20 overflow-hidden">
                  <h2 className="text-3xl font-black mb-10 text-gray-950 leading-tight">Send us a <span className="text-cyan-600">Message</span></h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cyan-600 uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" required className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+92..." className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Company</label>
                        <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Your Company" className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Inquiry Type" className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Message</label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="How can we help?" required rows={4} className="w-full bg-cyan-50 border border-cyan-100 rounded-2xl px-6 py-4 text-gray-950 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all resize-none placeholder:text-gray-400 shadow-inner shadow-cyan-100/30" />
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-xl shadow-cyan-200 disabled:opacity-70">
                      <Send className="w-5 h-5" /> {isSubmitting ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. PREFER TO EXPLORE SECTION */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-950 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center shadow-2xl shadow-gray-900/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Prefer to <span className="text-cyan-400">Explore</span> First?</h2>
                <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">Check out our latest tech courses or book a free demo class to experience our learning environment.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/courses" className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black hover:bg-cyan-100 transition-all shadow-xl shadow-cyan-100/10">
                    Browse Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="/demo-class" className="px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-black hover:bg-white/10 transition-all">
                    Book Demo Class
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;