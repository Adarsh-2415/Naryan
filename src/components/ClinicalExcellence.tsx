"use client";

import { Check, ShieldCheck, Heart, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function ClinicalExcellence() {
  const highlights = [
    { text: "Fully Equipped Pathology Lab" },
    { text: "Affordable Diagnostic & Clinical Tests" },
    { text: "Patient-First Care Model" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">

      {/* Decorative background shape */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-brand-light/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Clinical Excellence Copy */}
          <ScrollReveal direction="left" className="lg:col-span-7 flex flex-col space-y-6 md:space-y-8">

            {/* Header section */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
                Clinical Focus
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Committed To Homeopathic Excellence
              </h2>
              <h3 className="font-heading font-semibold text-lg md:text-xl text-cta">
                We Create Beautiful and Brighter Smiles
              </h3>
              <p className="text-text-body/95 text-sm md:text-base leading-relaxed max-w-2xl">
                At Narayan Homoeopathic Chikitsalaya, we create beautiful and brighter smiles. Our dedicated team, with years of homeopathic and clinical experience, is committed to providing you with the best care. We offer a wide range of affordable pathological and clinical tests through our newly added, fully equipped pathology lab. Your health and happiness are our top priorities.
              </p>
            </div>

            {/* List of check highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-1 bg-green-50 text-cta rounded-full border border-green-150">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-brand-dark">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons Row */}
            <div className="pt-6 border-t border-slate-100 max-w-xl w-full">
              <div className="grid grid-cols-3 gap-2.5 md:gap-4">
                <Link
                  href="/awards"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-secondary/30 hover:bg-brand-light/10 text-center transition-all duration-300 hover:shadow-md group cursor-pointer"
                >
                  <span className="text-xl mb-1.5 transition-transform duration-300 group-hover:scale-115">🏆</span>
                  <span className="font-heading font-extrabold text-[10px] md:text-xs text-brand-dark transition-colors duration-300 group-hover:text-brand-secondary block leading-tight">Explore Awards</span>
                  <span className="text-[8px] text-text-body/60 mt-1.5 hidden md:block leading-tight">Discover our prestigious Awards</span>
                </Link>
                <Link
                  href="/case-studies"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-secondary/30 hover:bg-brand-light/10 text-center transition-all duration-300 hover:shadow-md group cursor-pointer"
                >
                  <span className="text-xl mb-1.5 transition-transform duration-300 group-hover:scale-115">📖</span>
                  <span className="font-heading font-extrabold text-[10px] md:text-xs text-brand-dark transition-colors duration-300 group-hover:text-brand-secondary block leading-tight">Read Case Studies</span>
                  <span className="text-[8px] text-text-body/60 mt-1.5 hidden md:block leading-tight">Insightful clinical recovery cases</span>
                </Link>
                <Link
                  href="/seminars"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-secondary/30 hover:bg-brand-light/10 text-center transition-all duration-300 hover:shadow-md group cursor-pointer"
                >
                  <span className="text-xl mb-1.5 transition-transform duration-300 group-hover:scale-115">🎤</span>
                  <span className="font-heading font-extrabold text-[10px] md:text-xs text-brand-dark transition-colors duration-300 group-hover:text-brand-secondary block leading-tight">View Seminars</span>
                  <span className="text-[8px] text-text-body/60 mt-1.5 hidden md:block leading-tight">Access our seminars & talks</span>
                </Link>
              </div>
            </div>

          </ScrollReveal>

          {/* Right Column: Premium Doctor Focus Card */}
          <ScrollReveal direction="right" className="lg:col-span-5 flex justify-center">

            <div className="relative group w-full max-w-[340px] md:max-w-[360px] bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100/90 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">

              {/* Doctor portrait wrapper */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                <Image
                  src="/doctor-image.jpg"
                  alt="Dr. Navneet Sharma D.H.M.S"
                  fill
                  sizes="(max-w-768px) 100vw, 360px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Bottom details card plate */}
              <div className="p-6 text-center border-t border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                <h4 className="font-heading font-bold text-xl text-brand-dark">
                  Dr. Navneet Sharma
                </h4>
                <p className="text-xs font-semibold text-brand-secondary tracking-widest uppercase mt-1">
                  D.H.M.S
                </p>
              </div>

            </div>

          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
