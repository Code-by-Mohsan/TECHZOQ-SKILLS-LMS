import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | TECHZOQ",
  description:
    "Explore detailed TECHZOQ service pages for custom tech solutions, web application development, mobile apps, blockchain, DevOps, UI/UX, analytics, and AI integration.",
  keywords: [
    "custom tech solutions",
    "web application development",
    "mobile app development",
    "blockchain technology services",
    "devops services",
    "ui ux design services",
    "data analytics cloud solutions",
    "ai machine learning integration",
  ],
  openGraph: {
    title: "Our Services - TECHZOQ",
    description:
      "Detailed service pages for TECHZOQ engineering, UX, cloud, AI, analytics, blockchain, and custom product delivery.",
    url: "https://techzoq.com/services",
    type: "website",
  },
  twitter: {
    title: "Our Services - TECHZOQ",
    description:
      "Detailed service pages for TECHZOQ engineering, UX, cloud, AI, analytics, blockchain, and custom product delivery.",
  },
  alternates: {
    canonical: "https://techzoq.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
