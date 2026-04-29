import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder & CEO | TECHZOQ",
  description:
    "Meet Manzoor Ahmad, Founder & CEO of TECHZOQ, and explore the vision behind practical tech talent development, AI-based skills, and agriculture-focused technology in Pakistan.",
  keywords: [
    "Manzoor Ahmad",
    "TECHZOQ founder",
    "CEO TECHZOQ",
    "IT institute in Kasur",
    "tech education in Kasur",
    "software architect Pakistan",
    "agriculture technology Pakistan",
  ],
  alternates: {
    canonical: "https://techzoq.com/founder",
  },
  openGraph: {
    title: "Founder & CEO | TECHZOQ",
    description:
      "Founder story, mission, and long-term vision behind TECHZOQ's technology, talent, and agriculture impact goals.",
    url: "https://techzoq.com/founder",
    type: "profile",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Founder of TECHZOQ",
      },
    ],
  },
  twitter: {
    title: "Founder & CEO | TECHZOQ",
    description:
      "Meet the founder behind TECHZOQ and the vision for technology, talent, and agriculture impact in Pakistan.",
    images: ["/og-image.png"],
  },
};

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
