"use client";

import React from "react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const WhatsAppWidget: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/923231001246"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Chat on WhatsApp"
      onClick={() =>
        trackEvent("whatsapp_click", {
          location: "floating_widget",
        })
      }
    >
      <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat with us
      </span>
      <svg
        className="w-8 h-8 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.373 0 .009 5.373.009 12A11.86 11.86 0 0 0 3.11 18.96L0 24l5.16-3.09A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.2-1.24-6.17-3.48-8.52zM12 22.5c-2.05 0-3.98-.6-5.62-1.64l-.4-.25-3.06 1.84 1.01-3.12-.26-.41A9.5 9.5 0 1 1 21.5 12 9.51 9.51 0 0 1 12 22.5z" />
        <path
          d="M18.5 14.1c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15s-.76.96-.93 1.16c-.17.2-.34.23-.63.08a6.78 6.78 0 0 1-2-.97 7.48 7.48 0 0 1-1.39-1.64c-.15-.27-.02-.42.12-.57.12-.12.27-.3.4-.45.13-.15.17-.25.27-.43.1-.18.05-.33-.02-.46-.07-.13-.67-1.61-.92-2.21-.24-.58-.48-.5-.66-.51-.17-.01-.37-.01-.57-.01s-.46.07-.7.34c-.24.27-.9.88-.9 2.15s.92 2.49 1.05 2.66c.12.18 1.82 2.78 4.42 3.9 2.6 1.12 2.6.75 3.07.7.47-.05 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.11-.27-.18-.57-.33z"
          fill="#fff"
        />
      </svg>
    </motion.a>
  );
};

export default WhatsAppWidget;
