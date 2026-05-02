"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-600 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h2>
              <p className="text-gray-600 mb-6">
                This Privacy Policy explains how TECHZOQ ("Company", "we",
                "our", or "us") collects, uses, discloses, and otherwise handles
                your information in connection with our website.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Information We Collect
              </h3>
              <p className="text-gray-600 mb-6">
                We may collect information about you in a variety of ways. The
                information we may collect on the site includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Your name, email address, phone number</li>
                <li>Company information</li>
                <li>Information about your inquiry or project</li>
                <li>Your browsing behavior and usage patterns</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Your Information
              </h3>
              <p className="text-gray-600 mb-6">
                Any of the information we collect from you may be used in one of
                the following ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>To process your transactions</li>
                <li>
                  To send periodic emails regarding your order or other products
                  and services
                </li>
                <li>To improve our website</li>
                <li>To administer a contest or promotion</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Protection of Information
              </h3>
              <p className="text-gray-600">
                Your personal information is contained behind secured networks
                and is only accessible by a limited number of persons who have
                special access rights to such systems, and are required to keep
                the information confidential.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h3>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact
                us at support@techzoq.com or +92 323 1001246.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
