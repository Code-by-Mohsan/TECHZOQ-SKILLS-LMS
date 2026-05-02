import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses & Training | TECHZOQ",
  description:
    "Learn from expert instructors at TECHZOQ. Explore our comprehensive courses in web development, AI, machine learning, mobile development, and more.",
  keywords: [
    "courses",
    "training",
    "web development",
    "AI training",
    "programming courses",
    "tech education",
    "online learning",
  ],
  openGraph: {
    title: "Courses & Training - TECHZOQ",
    description: "Comprehensive tech courses and training programs",
    url: "https://techzoq.com/courses",
    type: "website",
  },
  twitter: {
    title: "Courses & Training - TECHZOQ",
    description: "Learn tech skills with expert instructors",
  },
  alternates: {
    canonical: "https://techzoq.com/courses",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
