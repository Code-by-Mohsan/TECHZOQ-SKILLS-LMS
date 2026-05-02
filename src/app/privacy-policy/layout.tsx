import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TECHZOQ",
  description:
    "Read TECHZOQ's privacy policy to understand how we protect your data and privacy.",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: "https://techzoq.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
