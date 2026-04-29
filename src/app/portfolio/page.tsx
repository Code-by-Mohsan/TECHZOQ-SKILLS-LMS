import { Metadata } from "next";
import PortfolioPageClient from "./PortfolioPageClient";

export const metadata: Metadata = {
  title: "Portfolio - Our Projects & Success Stories",
  description:
    "Explore TECHZOQ's portfolio of successful projects in web development, AI, machine learning, and digital solutions. See our latest work and client success stories.",
  keywords:
    "portfolio, projects, case studies, web development, AI solutions, machine learning projects, tech showcase",
  openGraph: {
    title: "Portfolio - TECHZOQ Success Stories",
    description:
      "Discover our latest projects and solutions in technology and digital innovation",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
