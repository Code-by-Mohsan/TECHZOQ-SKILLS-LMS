import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Orbitron, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

// Font imports with CSS variable names
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://techzoq.com"),
  title: {
    default: "TECHZOQ Skills | IT Courses, Software Training & Admissions",
    template: "%s | TECHZOQ",
  },
  description:
    "TECHZOQ Skills is an IT training institute in Kasur offering practical courses in web development, AI, freelancing, software engineering, admissions support, and career-focused tech education.",
  keywords: [
    "IT courses in Kasur",
    "software training institute",
    "web development course",
    "AI course",
    "freelancing course",
    "programming institute in Pakistan",
    "tech education",
    "career training",
    "student admissions",
    "TECHZOQ Skills",
  ],
  authors: [{ name: "TECHZOQ", url: "https://techzoq.com" }],
  creator: "TECHZOQ",
  publisher: "TECHZOQ",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "256x256", type: "image/png" }
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "TECHZOQ Skills | IT Courses, Software Training & Admissions",
    description:
      "Explore TECHZOQ Skills courses in web development, AI, software engineering, freelancing, and practical tech career training.",
    url: "https://techzoq.com",
    siteName: "TECHZOQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TECHZOQ Skills - IT courses and software training in Kasur",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
    countryName: "Pakistan",
  },
  twitter: {
    card: "summary_large_image",
    title: "TECHZOQ Skills | IT Courses & Software Training",
    description:
      "Practical IT courses, admissions support, and career-focused training from TECHZOQ Skills.",
    images: ["/og-image.png"],
    creator: "@techzoq",
    site: "@techzoq",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techzoq.com",
    languages: {
      "en-US": "https://techzoq.com",
      en: "https://techzoq.com",
    },
  },
  category: "Technology",
  classification: "Software Development",
  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00f260" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="TECHZOQ" />
        
        <link rel="canonical" href="https://techzoq.com" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0ZLVSVDTW3"
        />
        <Script id="google-analytics" suppressHydrationWarning>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0ZLVSVDTW3');
          `}
        </Script>
        {/* JSON-LD Schema Markup */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          suppressHydrationWarning
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://techzoq.com/#organization",
            name: "TECHZOQ",
            alternateName: "Tech Zoq",
            url: "https://techzoq.com",
            logo: {
              "@type": "ImageObject",
              url: "https://techzoq.com/logo.svg",
              width: 250,
              height: 60,
            },
            description:
              "IT training institute offering practical software courses, admissions guidance, and career-focused tech education",
            founder: {
              "@type": "Person",
              name: "TECHZOQ Team",
            },
            foundingDate: "2020",
            foundingLocation: "Pakistan",
            address: {
              "@type": "PostalAddress",
              addressCountry: "PK",
            },
            telephone: "+92-323-1001246",
            email: "support@techzoq.com",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+92-323-1001246",
              contactType: "Customer Service",
            },
            sameAs: [
              "https://www.facebook.com/techzoq",
              "https://www.twitter.com/techzoq",
              "https://www.linkedin.com/company/techzoq",
            ],
            areaServed: ["Kasur", "Punjab", "Pakistan"],
            knowsAbout: [
              "IT Courses in Kasur",
              "Web Development",
              "Artificial Intelligence",
              "Freelancing",
              "Software Engineering",
              "Student Admissions",
              "Career Training",
            ],
          })}
        </Script>
        <Script
          id="website-schema"
          type="application/ld+json"
          suppressHydrationWarning
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://techzoq.com/#website",
            url: "https://techzoq.com",
            name: "TECHZOQ",
            description: "IT courses, software training, and admissions platform",
            publisher: {
              "@id": "https://techzoq.com/#organization",
            },
          })}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Footer />
          <WhatsAppWidget />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
