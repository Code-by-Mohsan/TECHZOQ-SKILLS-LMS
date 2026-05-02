import type { Metadata } from "next";
import Header from "@/components/Header";
import CoworkingSection from "../../components/CoworkingSection";

export const metadata: Metadata = {
  title: "Coworking · Techzoq",
  description:
    "Flexible, community-driven coworking spaces and meeting rooms — designed for makers, builders and small teams.",
};

export default function CoworkingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main id="main" className="container mx-auto px-4 py-10 lg:py-16">
        <CoworkingSection />
      </main>
    </div>
  );
}
