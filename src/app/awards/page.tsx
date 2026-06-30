"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Award, Calendar, ArrowRight } from "lucide-react";

// Fallback awards list
const fallbackAwards: any[] = [];

export default function AwardsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pages/awards?published=true")
      .then(res => res.json())
      .then(data => {
        if (data?.success && data?.items?.length > 0) {
          setItems(data.items);
        } else {
          setItems(fallbackAwards);
        }
      })
      .catch(() => {
        setItems(fallbackAwards);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                <pattern id="awards-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#awards-grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <ScrollReveal direction="up" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs tracking-wide shadow-sm uppercase border border-brand-soft/20 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                Recognitions & Milestones
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                  Awards &{" "}
                  <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent">
                    Certifications
                  </span>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200}>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  Celebrating professional excellence, medical certifications, and community service accolades received by Narayan Homoeopathic Chikitsalaya over the decades.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CONTENT LISTING / EMPTY STATE SECTION */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] w-full bg-slate-200 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : items.length === 0 ? (
              /* PREMIUM EMPTY STATE */
              <ScrollReveal direction="up" className="max-w-md mx-auto text-center bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-light/20 blur-2xl" />
                
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light/50 text-[#018ABE] flex items-center justify-center shadow-inner relative z-10">
                  <Award size={32} />
                </div>
                
                <div className="space-y-2 relative z-10">
                  <h3 className="font-heading font-bold text-xl text-brand-dark">No Awards Added Yet</h3>
                  <p className="text-xs md:text-sm text-text-body/75 leading-relaxed">
                    We are currently cataloging our certifications, awards, and community highlights. The updated achievements log will be published shortly.
                  </p>
                </div>
                
                <div className="pt-4 relative z-10">
                  <a
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-white text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </ScrollReveal>
            ) : (
              /* ACTIVE AWARDS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, idx) => (
                  <ScrollReveal
                    key={item.id || idx}
                    direction="up"
                    delay={idx * 150}
                    className="flex"
                  >
                    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full relative">
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100 shrink-0">
                        <Image
                          src={item.image_url}
                          alt={item.title || "Award Certification"}
                          fill
                          sizes="(max-w-768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                      
                      {item.title && (
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark leading-snug">
                            {item.title}
                          </h3>
                          <div className="pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs text-text-body/70 font-semibold mt-4">
                            <Calendar size={13} className="text-[#018ABE]" /> {item.created_at ? new Date(item.created_at).getFullYear().toString() : "2026"}
                          </div>
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
