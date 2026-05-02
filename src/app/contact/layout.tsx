import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | TECHZOQ",
  description:
    "Get in touch with TECHZOQ. Contact us for inquiries about our services, courses, or partnerships. We're here to help!",
  keywords: ["contact", "get in touch", "inquiry", "support", "email", "phone"],
  openGraph: {
    title: "Contact TECHZOQ",
    description: "Reach out to us for any inquiries or support",
    url: "https://techzoq.com/contact",
    type: "website",
  },
  twitter: {
    title: "Contact TECHZOQ",
    description: "Get in touch with us",
  },
  alternates: {
    canonical: "https://techzoq.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
