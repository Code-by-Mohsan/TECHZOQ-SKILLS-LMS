"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, BookOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { SERVICE_NAV_ITEMS } from "@/lib/content/services";
import {
  canAccessStudentDashboard,
  isAdminRole,
  normalizeRole,
} from "@/lib/constants/auth";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const services = SERVICE_NAV_ITEMS;

  const navItems = [
    { href: "/about", label: "Who We Are" },
    // { href: "/founder", label: "Founder" },
    { href: "/career-counseling-kasur", label: "Career Counseling" },
    { label: "What We Do", submenu: true },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/courses", label: "Skill Programs" },
    { href: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setServicesOpen(false);
      }
    }

    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const first = document.querySelector(
          ".mobile-menu [href]",
        ) as HTMLElement | null;
        first?.focus();
      }, 50);
    }
  }, [isOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Skip to content
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
        <nav
          role="navigation"
          aria-label="Primary"
          className={`max-w-6xl mx-auto flex items-center justify-between px-6 py-2.5 rounded-xl transition-all duration-300 ${
            scrolled
              ? "bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border border-white/10"
              : "bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border border-white/10"
              // ? "bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border border-white/10"
              // : "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <motion.div
              className="flex items-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/logo.svg"
                alt="TECHZOQ logo"
                width={160}
                height={24}
                className="w-32 h-6 sm:w-36 sm:h-7 md:w-40 md:h-7 object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Divider */}
          <div className="hidden lg:block w-px h-5 bg-white/10 mx-2" />

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  <div className="relative group" ref={servicesRef}>
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={servicesOpen}
                      aria-controls="services-dropdown"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 font-normal transition-all duration-200 ${
                        servicesOpen
                          ? "text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          id="services-dropdown"
                          role="menu"
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setServicesOpen(true)}
                          onMouseLeave={() => setServicesOpen(false)}
                          className="absolute top-full left-0 mt-3 w-[32rem] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50"
                        >
                          <div className="grid grid-cols-2 gap-1 p-3">
                            {services.map((service, idx) => (
                              <Link key={idx} href={service.href} role="menuitem" className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-150 group">
                                <span className="text-lg shrink-0" aria-hidden>{service.icon}</span>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white line-clamp-2">{service.label}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-white/5 p-3">
                            <Link href="/services" className="text-center text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 transition-colors">
                              View All Services
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`px-3.5 py-1.5 font-normal whitespace-nowrap transition-all duration-200 ${
                      pathname === item.href
                        ? "text-white font-medium"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <NotificationBell />

            {/* Login / User Menu */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  {isAdminRole(user.role) && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-300 hover:text-purple-200  transition-colors"
                    >
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      <LayoutDashboard className="w-4 h-4" />
                      {/* {user.name.charAt(0).toUpperCase()} */}
                    </div>
                    <span className="text-sm font-medium  text-purple-300 hover:text-purple-200 max-w-[100px] truncate">{user.name}</span>
                  </div>
                    </Link>
                  )}
                  {canAccessStudentDashboard(user.role) && (
                    <Link
                      href={
                        normalizeRole(user.role) === "instructor" ||
                        normalizeRole(user.role) === "teaching_assistant"
                          ? "/dashboard/instructor"
                          : "/dashboard/student"
                      }
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-300 hover:text-blue-200 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      My Learning
                    </Link>
                  )}
                 
                  <button
                    type="button"
                    onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 via-green-500/90 to-sky-600 rounded-xl shadow-[0px_2px_4px_-2px_rgba(34,197,94,0.20),0px_4px_6px_-1px_rgba(34,197,94,0.20)] hover:shadow-[0px_4px_8px_-2px_rgba(34,197,94,0.30),0px_8px_12px_-2px_rgba(34,197,94,0.30)] transition-all duration-300 hover:scale-[1.02]"
                    title="Logout"
                  >
                    Logout
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 via-green-500/90 to-sky-600 rounded-xl shadow-[0px_2px_4px_-2px_rgba(34,197,94,0.20),0px_4px_6px_-1px_rgba(34,197,94,0.20)] hover:shadow-[0px_4px_8px_-2px_rgba(34,197,94,0.30),0px_8px_12px_-2px_rgba(34,197,94,0.30)] transition-all duration-300 hover:scale-[1.02]"
                >
                  Login
                     <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

          

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-300 p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                key="mobile-menu"
                className="mt-2 mx-4 sm:mx-6 lg:mx-8 max-w-6xl lg:mx-auto z-50 relative lg:hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40"
                initial={{ y: -10, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                ref={mobileRef}
              >
                <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 max-h-[70vh] overflow-y-auto mobile-menu">
                  <ul className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        {item.submenu ? (
                          <div>
                            <button
                              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                              className="text-slate-300 text-base font-medium hover:text-white py-2.5 px-3 rounded-xl transition-colors hover:bg-white/5 w-full text-left flex items-center justify-between"
                            >
                              Services
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                            </button>
                            {mobileServicesOpen && <div className="mt-1 ml-3 pl-3 space-y-1 border-l border-white/10">
                              {services.map((service, idx) => (
                                <Link
                                  key={idx}
                                  href={service.href}
                                  className="text-slate-400 text-sm hover:text-white block py-2 px-3 rounded-xl transition-colors hover:bg-white/5"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="mr-2">{service.icon}</span>
                                  {service.label}
                                </Link>
                              ))}
                            </div>}
                          </div>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            className={`text-base font-medium block py-2.5 px-3 rounded-xl transition-colors ${
                              pathname === item.href
                                ? "text-white bg-white/10"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 px-3 py-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                        {isAdminRole(user.role) && (
                          <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-purple-300 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        {canAccessStudentDashboard(user.role) && (
                          <Link href={normalizeRole(user.role) === "instructor" || normalizeRole(user.role) === "teaching_assistant" ? "/dashboard/instructor" : "/dashboard/student"} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-300 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                            <BookOpen className="w-4 h-4" />
                            My Learning
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => { setIsOpen(false); handleLogout(); }}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-white/5 rounded-xl transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-3">
                        <Link href="/login" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 text-center border border-white/10 hover:bg-white/5 transition-colors" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                        <Link href="/get-quote" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white text-center bg-gradient-to-r from-green-500 to-sky-600 transition-colors" onClick={() => setIsOpen(false)}>
                          Get Quote
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
