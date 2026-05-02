"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Please read our terms carefully
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
                Terms of Service
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to TECHZOQ. These terms and conditions outline the rules
                and regulations for the use of our website.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Use License
              </h3>
              <p className="text-gray-600 mb-6">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on TECHZOQ's website for
                personal, non-commercial transitory viewing only.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Disclaimer
              </h3>
              <p className="text-gray-600 mb-6">
                The materials on TECHZOQ's website are provided on an 'as is'
                basis. TECHZOQ makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Limitations
              </h3>
              <p className="text-gray-600 mb-6">
                In no event shall TECHZOQ or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on TECHZOQ's website.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Accuracy of Materials
              </h3>
              <p className="text-gray-600 mb-6">
                The materials appearing on TECHZOQ's website could include
                technical, typographical, or photographic errors. TECHZOQ does
                not warrant that any of the materials on its website are
                accurate, complete, or current.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Links</h3>
              <p className="text-gray-600 mb-6">
                TECHZOQ has not reviewed all of the sites linked to its website
                and is not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by TECHZOQ
                of the site.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Modifications
              </h3>
              <p className="text-gray-600 mb-6">
                TECHZOQ may revise these terms of service for its website at any
                time without notice. By using this website, you are agreeing to
                be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h3>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please
                contact us at support@techzoq.com or +92 323 1001246.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
