"use client";

import { UserCheck, Heart, Handshake, Landmark } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function ValuesGrid() {
  const cards = [
    {
      icon: <UserCheck size={26} />,
      title: "Experienced Doctors",
      desc: "Our clinic is supported by qualified and experienced homeopathic doctors dedicated to providing personalized and ethical patient care.",
      color: "text-brand-primary",
      bgColor: "bg-brand-light/30",
    },
    {
      icon: <Heart size={26} />,
      title: "Personalized Homeopathic Care",
      desc: "We offer individualized homeopathic treatment plans based on detailed case analysis and patient-specific needs.",
      color: "text-cta",
      bgColor: "bg-green-50",
    },
    {
      icon: <Handshake size={26} />,
      title: "Ethical & Holistic Treatment",
      desc: "Our approach focuses on safe, gentle, and holistic healing, aiming for long-term improvement in overall health and well-being.",
      color: "text-brand-secondary",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Landmark size={26} />,
      title: "Affordable Diagnostic Facilities",
      desc: "Our clinic is equipped with modern pathology and diagnostic facilities to support accurate assessment and effective treatment planning.",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Centered Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-dark leading-tight">
            Complete Care on Your Schedule
          </h2>
          <p className="text-brand-secondary font-heading font-medium text-base md:text-lg italic">
            Homoeo : The Natural Way To Wellness
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 150} // Staggered delays: 0, 150, 300, 450
              className="h-full"
            >
              <div className="group relative h-full bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col items-center text-center">

                {/* Custom Border animation highlight (bottom line slide-out from center) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-350 ease-out origin-center" />
                <div className="absolute top-0 bottom-0 left-0 right-0 border border-transparent group-hover:border-brand-secondary/20 rounded-2xl transition-all duration-350 pointer-events-none" />

                {/* Icon wrapper with hover color scaling */}
                <div className={`w-14 h-14 rounded-full ${card.bgColor} ${card.color} flex items-center justify-center mb-6 shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-xs md:text-sm text-text-body/90 leading-relaxed flex-grow">
                  {card.desc}
                </p>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
