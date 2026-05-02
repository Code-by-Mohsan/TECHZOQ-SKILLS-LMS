import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TECHZOQ",
  description:
    "Review TECHZOQ's terms of service and conditions of use for our website and services.",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: "https://techzoq.com/terms-of-service",
  },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
