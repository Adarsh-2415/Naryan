"use client";

import { useState, useEffect } from "react";
import { Award, Users, ShieldAlert, ArrowRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "/doctor-3-orig.jpg",
    name: "",
    alt: "Narayan Homoeopathic Chikitsalaya Clinic View"
  },
  {
    image: "/doctor-2-new.jpg",
    name: "Dr. Navneet Sharma",
    alt: "Dr. Navneet Sharma - Senior Homeopathic Consultant"
  },
  {
    image: "/doctor-3-new.jpg",
    name: "Dr. Asha Sharma",
    alt: "Dr. Asha Sharma -  Homeopathic Consultant"
  },
  {
    image: "/doctor-4.jpg",
    name: "",
    alt: "Narayan Homoeopathic Chikitsalaya Laboratory and Staff"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-tr from-[#D6E8EE]/30 via-[#F8FAFC] to-white overflow-hidden pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24">

      {/* Premium Background Blurs & Vector Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-brand-soft/15 blur-3xl animate-float-delayed" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full bg-brand-light/20 blur-3xl animate-float" />

        {/* Soft geometric grid overlay (5-8% opacity) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-6"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Authoritative Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8">

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs md:text-sm tracking-wide shadow-sm uppercase border border-brand-soft/20">
              <span className="w-2 h-2 rounded-full bg-cta" />
              Personalized Homeopathic Treatment Since 1999
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.1] tracking-tight">
              Personalized Homeopathic Care for{" "}
              <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent animate-text-gradient">
                Lasting Health & Wellness
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base md:text-lg text-text-body/90 max-w-xl leading-relaxed">
              Experience safe, gentle, and highly effective homeopathy treatments tailored specifically to your body's unique ecosystem. We focus on diagnosing and addressing root causes to foster long-term recovery.
            </p>

            {/* CTA Buttons (Option B) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href="/booking"
                className="bg-cta hover:bg-cta-hover text-white text-center font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-cta/25 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cta/50 flex items-center justify-center gap-2 group"
              >
                <span>Book Appointment</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#treatments"
                className="bg-white hover:bg-slate-50 text-brand-primary text-center font-semibold px-8 py-4 rounded-full border border-slate-200 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                Explore Treatments
              </a>

            </div>
          </div>

          {/* Right Column: Visual Layout with Floating Cards */}
          <div className="lg:col-span-5 flex justify-center relative select-none">

            {/* Soft Rotating Halo behind the Doctor Frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] max-w-[450px] max-h-[450px] aspect-square rounded-full border-2 border-dashed border-brand-soft/40 animate-spin-slow pointer-events-none z-0" />

            {/* Doctor Image Container with Premium Shape and Cross-Fade Slider */}
            <div className="relative w-full max-w-[360px] md:max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl z-10 bg-slate-100">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-w-768px) 100vw, 400px"
                    className="object-cover"
                  />
                  {/* Doctor Name Overlay Badge */}
                  {slide.name && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark/95 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full shadow-lg z-20 text-center whitespace-nowrap">
                      <p className="text-white font-bold text-xs sm:text-sm md:text-base">{slide.name}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Slider Dots Navigation indicators */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Trust Cards */}

            {/* Card 1: 25+ Years Experience (Top Left) */}
            <div className="absolute -top-4 -left-6 md:-left-8 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20 max-w-[170px] md:max-w-[190px]">
              <div className="p-2.5 rounded-xl bg-brand-light/50 text-brand-primary">
                <Award size={20} />
              </div>
              <div>
                <p className="font-heading font-extrabold text-brand-dark text-sm md:text-base leading-none">25+ Years</p>
                <p className="text-[10px] md:text-xs text-text-body font-medium mt-0.5 leading-none">Clinical Experience</p>
              </div>
            </div>

            {/* Card 2: 1,000+ Treated Patients (Middle Right) */}
            <div className="absolute top-1/3 -right-6 md:-right-10 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20 max-w-[170px] md:max-w-[190px]">
              <div className="p-2.5 rounded-xl bg-green-50 text-cta">
                <Users size={20} />
              </div>
              <div>
                <p className="font-heading font-extrabold text-brand-dark text-sm md:text-base leading-none">1,000+</p>
                <p className="text-[10px] md:text-xs text-text-body font-medium mt-0.5 leading-none">Treated Patients</p>
              </div>
            </div>

            {/* Card 3: Award Winning Practice (Bottom Left) */}
            <div className="absolute bottom-20 md:bottom-24 -left-6 md:-left-12 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20 max-w-[170px] md:max-w-[200px]">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500">
                <Award size={20} />
              </div>
              <div>
                <p className="font-heading font-extrabold text-brand-dark text-sm md:text-base leading-none">Award Winning</p>
                <p className="text-[10px] md:text-xs text-text-body font-medium mt-0.5 leading-none">Best Homeopathic Clinic</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
