import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Counseling in Kasur | TECHZOQ",
  description:
    "Book career counseling in Kasur with TECHZOQ. Get guided on career confusion, course selection, AI, web, cloud, freelancing, and your next learning path.",
  keywords: [
    "career counseling kasur",
    "career guidance in kasur",
    "tech career counseling",
    "course guidance kasur",
    "TECHZOQ counseling",
  ],
  alternates: {
    canonical: "https://techzoq.com/career-counseling-kasur",
  },
  openGraph: {
    title: "Career Counseling in Kasur | TECHZOQ",
    description:
      "Confused about your career? Book a guided counseling session with TECHZOQ in Kasur.",
    url: "https://techzoq.com/career-counseling-kasur",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Counseling in Kasur by TECHZOQ",
      },
    ],
  },
};

export default function CareerCounselingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
