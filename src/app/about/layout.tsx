import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us | TECHZOQ",
  description:
    "Learn about TECHZOQ - our mission, vision, values, and team. Discover how we're transforming the tech industry since 2020 with 50+ projects delivered.",
  keywords: [
    "about TECHZOQ",
    "company mission",
    "team",
    "values",
    "tech education",
  ],
  openGraph: {
    title: "About TECHZOQ - Our Story & Mission",
    description:
      "Learn about TECHZOQ's journey, mission to democratize tech education, and our team of expert developers and educators",
    url: "https://techzoq.com/about",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TECHZOQ - About Us",
      },
    ],
  },
  twitter: {
    title: "About TECHZOQ",
    description: "Learn about our mission, vision, and team of experts",
  },
  alternates: {
    canonical: "https://techzoq.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
