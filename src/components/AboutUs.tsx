"use client";

import { Home, Calendar, PlusSquare, ArrowRight } from "lucide-react";
import ImageComponent from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function AboutUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-brand-light/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Rich Content & Feature Cards */}
          <ScrollReveal direction="left" className="lg:col-span-7 flex flex-col space-y-6 md:space-y-8">
            
            {/* Header copy */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
                Our History & Mission
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Welcome to Narayan Homoeopathic Chikitsalaya
              </h2>
              <p className="text-text-body/90 text-sm md:text-base leading-relaxed max-w-2xl">
                Narayan Charitable Homoeopathic Chikitsalya was Estb. in Year 1984. By Late Pt. Manohar Lal Sharma ji (Hon. Magistrate) and passionate about Homoeopathy.
              </p>
            </div>

            {/* Feature Cards Stack */}
            <div className="space-y-6">
              
              {/* Card 1: Friendly Clinic */}
              <div className="flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] group">
                <div className="p-3 bg-brand-light/50 text-brand-primary rounded-xl shrink-0 h-fit transition-transform duration-300 group-hover:scale-110">
                  <Home size={22} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark transition-colors duration-300 group-hover:text-brand-secondary">
                    Friendly Clinic Near You
                  </h3>
                  <p className="text-xs md:text-sm text-text-body/80 leading-relaxed">
                    Narayan Homoeopathic Chikitsalaya periodically organizes general routine medical camps in all north india since 1999.
                  </p>
                </div>
              </div>

              {/* Card 2: Experienced Doctors */}
              <div className="flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] group">
                <div className="p-3 bg-green-50 text-cta rounded-xl shrink-0 h-fit transition-transform duration-300 group-hover:scale-110">
                  <PlusSquare size={22} className="transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark transition-colors duration-300 group-hover:text-brand-secondary">
                    Experienced Doctors
                  </h3>
                  <p className="text-xs md:text-sm text-text-body/80 leading-relaxed">
                    Dr. Navneet & Dr. Asha Sharma, with homeopathic experience, rebranded Narayan Homoeopathic & added a pathology lab.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="/booking"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-brand-primary border border-slate-200 font-semibold px-6 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <Calendar size={18} className="text-brand-secondary" />
                <span>Know More</span>
              </a>
            </div>

          </ScrollReveal>

          {/* Right Column: Visual Frame featuring sign board image */}
          <ScrollReveal direction="right" className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-[340px] md:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 hover:-translate-y-2 hover:rotate-1 bg-slate-100">
              
              {/* Abstract decorative frame shadow element */}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-dark/20 via-transparent to-transparent opacity-80 pointer-events-none" />

              <ImageComponent
                src="/about-sign.png"
                alt="Narayan Homoeopathic Chikitsalaya Sign Board"
                fill
                sizes="(max-w-768px) 100vw, 380px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
