"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Script from "next/script";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesPreview from "@/components/ServicesPreview";
import CoworkingPreview from "@/components/CoworkingPreview";
import CoursesPreview from "@/components/CoursesPreview";
import CareerCounselingSection from "@/components/CareerCounselingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

// Note: Metadata should be in a layout file or not used in client components
// This page uses client-side hooks for splash animation
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <LayoutGroup id="shared-logo">
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* SEO Schema */}
        <Script
          id="homepage-schema"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://techzoq.com/#webpage",
              url: "https://techzoq.com",
              name: "TECHZOQ Skills - IT Courses & Software Training",
              description:
                "Join TECHZOQ Skills for practical IT courses, admissions support, and career-focused software training in Kasur",
              isPartOf: {
                "@id": "https://techzoq.com/#website",
              },
              primaryImageOfPage: {
                "@type": "ImageObject",
                url: "https://techzoq.com/og-image.png",
                width: 1200,
                height: 630,
              },
              datePublished: "2020-01-01",
              dateModified: new Date().toISOString(),
            }),
          }}
        />

        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              key="splash"
              className="fixed inset-0 z-60 flex items-center justify-center bg-linear-to-br from-[#02071c] via-primary-900 to-primary-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                layoutId="logo"
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.7, y: -120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
                className="text-center"
              >
                <motion.div
                  className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl p-4"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/logo.svg"
                    alt="TECHZOQ logo"
                    width={96}
                    height={32}
                    className="w-full h-full object-contain"
                    priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Site Content */}
        {!showSplash && (
          <>
            <Header />

            <motion.main
              role="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen"
            >
              <HeroSection />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FeaturesSection />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <ServicesPreview />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <CoworkingPreview />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                <CoursesPreview />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
              >
                <CareerCounselingSection />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
              >
                <TestimonialsSection />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36 }}
              >
                <CTASection />
              </motion.div>
            </motion.main>
          </>
        )}
      </div>
    </LayoutGroup>
  );
}
