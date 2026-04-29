import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for IT Courses | TECHZOQ",
  description:
    "Apply online for TECHZOQ Skills courses in web development, AI, freelancing, and software engineering. Complete your admissions form and start your tech career.",
  alternates: {
    canonical: "https://techzoq.com/apply",
  },
  openGraph: {
    title: "Apply for IT Courses | TECHZOQ",
    description:
      "Start your TECHZOQ Skills application for practical, career-focused IT training.",
    url: "https://techzoq.com/apply",
    type: "website",
  },
  twitter: {
    title: "Apply for IT Courses | TECHZOQ",
    description:
      "Start your TECHZOQ Skills application for practical, career-focused IT training.",
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

