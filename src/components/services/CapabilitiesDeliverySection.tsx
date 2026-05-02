import React from "react";

const capabilities = [
  {
    icon: "🛠️", // Replace with your icon or SVG
    title: "Agile Delivery",
    description:
      "Rapid, iterative project execution ensuring continuous value delivery and adaptability to change.",
  },
  {
    icon: "📦",
    title: "End-to-End Solutions",
    description:
      "Comprehensive services from ideation to deployment, covering every aspect of your digital journey.",
  },
  {
    icon: "⚡",
    title: "Performance Optimization",
    description:
      "Continuous monitoring and tuning for high-speed, reliable, and scalable digital products.",
  },
  {
    icon: "🔒",
    title: "Security by Design",
    description:
      "Proactive security integration at every stage, safeguarding your data and operations.",
  },
  {
    icon: "🔗",
    title: "Seamless Integrations",
    description:
      "Effortless connectivity with third-party tools and platforms for a unified workflow.",
  },
  {
    icon: "📈",
    title: "Scalable Architecture",
    description:
      "Future-ready systems designed to grow with your business and handle increasing demand.",
  },
];

export default function CapabilitiesDeliverySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
            Delivery Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">
            Capabilities Built Around Delivery
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We deliver high-impact solutions with a focus on speed, quality, and seamless integration, empowering your business to excel in the digital era.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4 text-2xl">
                {cap.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {cap.title}
              </h3>
              <p className="text-gray-500 text-base">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
