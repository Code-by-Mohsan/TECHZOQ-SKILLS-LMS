import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | TECHZOQ",
  description:
    "Welcome to TECHZOQ - Your partner in AI, machine learning, and custom software development. Transform your business with cutting-edge technology solutions.",

icons: {
  icon: "/icon.svg",
  apple: "/icon.svg",
},

  openGraph: {
    title: "TECHZOQ - Home",
    description:
      "Transform your business with TECHZOQ's cutting-edge AI and custom software solutions",
    url: "https://techzoq.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TECHZOQ",
      },
    ],
  },

  twitter: {
    title: "TECHZOQ - Home",
    description:
      "Transform your business with TECHZOQ's cutting-edge AI and custom software solutions",
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};
