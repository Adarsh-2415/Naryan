"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Baby, Sparkles, ArrowRight, Activity, Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const treatmentsData = [
  {
    id: "cardiovascular",
    title: "Cardiovascular Health",
    tag: "Cardiology",
    icon: Heart,
    iconColor: "text-red-500 bg-red-50",
    image: "/cardiovascular.png",
    intro: "Specialized clinical pathways focusing on safe, non-invasive support for cardiac and vascular disorders.",
    conditions: [
      "Chronic heart conditions & recovery",
      "Vein blockages & circulation issues",
      "Low functioning of cardiac valves",
      "Congenital conditions (Hole in heart)",
      "Blood pressure stabilization (Hypertension)"
    ]
  },
  {
    id: "infant-health",
    title: "Infant Health Issues",
    tag: "Pediatrics",
    icon: Baby,
    iconColor: "text-amber-500 bg-amber-50",
    image: "/infant.png",
    intro: "Extremely gentle, natural remedies to restore health, build immunity, and support growth in infants.",
    conditions: [
      "Loss of appetite & poor digestion",
      "Infant Jaundice management",
      "Splenomegaly (Enlarged spleen)",
      "Frequent colds, fevers & weak immunity",
      "Teething difficulties & colic relief"
    ]
  },
  {
    id: "leucorrhoea",
    title: "Leucorrhoea Treatment",
    tag: "Gynaecology",
    icon: Sparkles,
    iconColor: "text-purple-500 bg-purple-50",
    image: "/leucorrhoea.png",
    intro: "Holistic therapies focusing on female endocrine balance, uterine health, and pelvic wellness.",
    conditions: [
      "Leucorrhoea (Abnormal vaginal discharge)",
      "Severe menstrual pain & cramps",
      "Breast & uterine lumps (Benign fibroids)",
      "Hormonal imbalances & irregular cycles",
      "Uterine tone and vitality restoration"
    ]
  }
];

export default function Treatments() {
  return (
    <section id="treatments" className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-slate-100">
      
      {/* Background visual accents */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-50/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-[#018ABE] tracking-widest uppercase block">
            Clinical Specialities
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-dark leading-tight">
            Targeted Homeopathic Treatments
          </h2>
          <div className="h-1 w-20 bg-brand-secondary mx-auto rounded-full" />
          <p className="text-text-body/80 text-sm md:text-base leading-relaxed">
            Addressing chronic and acute disorders at their roots. We provide highly individualized, scientific homeopathic solutions aimed at long-lasting recovery and absolute safety.
          </p>
        </div>

        {/* 3-Column Treatments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {treatmentsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <ScrollReveal 
                key={item.id} 
                direction="up" 
                delay={idx * 150}
                className="flex"
              >
                <div className="group bg-white rounded-3xl border border-slate-100 hover:border-brand-secondary/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col w-full relative">
                  
                  {/* Card Image Container */}
                  <div className="h-64 md:h-72 w-full overflow-hidden relative bg-slate-50 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    
                    {/* Visual Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                    {/* Tag Badge */}
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-dark font-heading text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    
                    <div>
                      {/* Title & Icon Header */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className={`p-2.5 rounded-xl shrink-0 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                          <IconComponent size={20} className="stroke-[2.5]" />
                        </div>
                        <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-text-body/75 leading-relaxed mb-6">
                        {item.intro}
                      </p>

                      {/* Bulleted conditions list */}
                      <div className="space-y-2.5 mb-6">
                        {item.conditions.map((cond, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2.5 text-xs text-text-body">
                            <span className="mt-0.5 p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                              <Check size={11} className="stroke-[3]" />
                            </span>
                            <span className="leading-tight font-medium">{cond}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Link indicator */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-secondary">
                      <span className="group-hover:text-brand-primary transition-colors">Clinical Guidance Available</span>
                      <Activity size={14} className="animate-pulse text-[#018ABE]" />
                    </div>

                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Explore More CTA Button */}
        <ScrollReveal direction="up" delay={450}>
          <div className="text-center">
            <Link
              href="/treatments"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#02457A] to-[#018ABE] hover:from-[#001B4B] hover:to-[#02457A] text-white text-sm font-semibold font-heading px-8 py-3.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer hover:scale-102"
            >
              <span>EXPLORE ALL TREATMENTS</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
