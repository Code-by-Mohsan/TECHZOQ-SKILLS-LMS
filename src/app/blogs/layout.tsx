import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Blog & Career Insights | TECHZOQ",
  description:
    "Read TECHZOQ insights on web development, AI, freelancing, software careers, and practical tech learning in Pakistan.",
  alternates: {
    canonical: "https://techzoq.com/blogs",
  },
  openGraph: {
    title: "Tech Blog & Career Insights | TECHZOQ",
    description:
      "Practical insights on software careers, learning paths, AI, freelancing, and tech growth.",
    url: "https://techzoq.com/blogs",
    type: "website",
  },
  twitter: {
    title: "Tech Blog & Career Insights | TECHZOQ",
    description:
      "Practical insights on software careers, learning paths, AI, freelancing, and tech growth.",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

