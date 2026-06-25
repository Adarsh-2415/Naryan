"use client";

import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

// Mock seminars data conforming to the future Sanity CMS schema
// The UI is designed to gracefully handle:
// 1. Image only
// 2. Image + Title
// 3. Image + Title + Description
const mockSeminars: any[] = [
  /*
  {
    id: "1",
    image: "/gallery-banner.png",
    title: "International Homeopathy Convention 2026",
    shortDescription: "A keynote session discussing constitutional therapeutics and medical advancements in clinical oncology care pathways.",
    date: "Feb 15, 2026",
    displayOrder: 1
  }
  */
];

export default function SeminarsPage() {
  return (
    <>
      <TopBar />
      <BrandingSection />
      <Navbar />

      <main className="flex-grow bg-slate-50/50">
        
        {/* HERO BANNER SECTION */}
        <section className="relative min-h-[40vh] flex items-center bg-gradient-to-tr from-[#D6E8EE]/40 via-[#F8FAFC] to-white overflow-hidden py-16 md:py-20 border-b border-slate-100">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-brand-soft/20 blur-3xl" />
            <div className="absolute bottom-[5%] left-[5%] w-80 h-80 rounded-full bg-brand-light/30 blur-3xl" />
            
            {/* Geometric Grid Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
            >
              <defs>
                <pattern id="seminars-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#seminars-grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <ScrollReveal direction="up" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs tracking-wide shadow-sm uppercase border border-brand-soft/20 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                Education & Outreach
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                  Seminars &{" "}
                  <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent">
                    Events
                  </span>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200}>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  Keeping connected with global standards: Professional developmental seminars, medical workshops, community healthcare engagements, and awareness campaigns.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CONTENT LISTING / EMPTY STATE SECTION */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            {mockSeminars.length === 0 ? (
              /* PREMIUM EMPTY STATE */
              <ScrollReveal direction="up" className="max-w-md mx-auto text-center bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-light/20 blur-2xl" />
                
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light/50 text-[#018ABE] flex items-center justify-center shadow-inner relative z-10">
                  <Calendar size={32} />
                </div>
                
                <div className="space-y-2 relative z-10">
                  <h3 className="font-heading font-bold text-xl text-brand-dark">No Seminars Scheduled</h3>
                  <p className="text-xs md:text-sm text-text-body/75 leading-relaxed">
                    Upcoming seminar highlights will appear here. We are currently scheduling workshops and outreach medical check-up events. Check back soon for updates.
                  </p>
                </div>
                
                <div className="pt-4 relative z-10">
                  <a
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-white text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>Contact Clinic</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </ScrollReveal>
            ) : (
              /* ACTIVE SEMINARS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockSeminars.map((item, idx) => (
                  <ScrollReveal
                    key={item.id}
                    direction="up"
                    delay={idx * 150}
                    className="flex"
                  >
                    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full relative">
                      
                      {/* Image Frame */}
                      <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title || "Seminar Image"}
                          fill
                          sizes="(max-w-768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                      
                      {/* Content block with adaptable layouts */}
                      {(item.title || item.shortDescription) && (
                        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            {item.title && (
                              <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark leading-snug">
                                {item.title}
                              </h3>
                            )}
                            {item.shortDescription && (
                              <p className="text-xs text-text-body/80 leading-relaxed">
                                {item.shortDescription}
                              </p>
                            )}
                          </div>
                          
                          {item.date && (
                            <div className="pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs text-[#018ABE] font-semibold mt-4">
                              <Calendar size={13} /> {item.date}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
