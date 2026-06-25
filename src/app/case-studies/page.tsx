"use client";

import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

// Mock case studies matching future Sanity CMS schema
const mockCaseStudies: any[] = [
  /*
  {
    id: "1",
    title: "Recovery from Chronic Allergic Asthma in Children",
    slug: "chronic-allergic-asthma-recovery",
    featuredImage: "/infant.png",
    excerpt: "A look into constitutional homeopathic treatment pathway that successfully cured severe, recurring respiratory distress in an 18-month old infant.",
    publishedDate: "June 2026"
  }
  */
];

export default function CaseStudiesPage() {
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
                <pattern id="cases-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cases-grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <ScrollReveal direction="up" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs tracking-wide shadow-sm uppercase border border-brand-soft/20 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                Clinical Outcomes
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                  Case{" "}
                  <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent">
                    Studies
                  </span>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200}>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  Real treatment journeys, deep clinical insights, patient experiences, and homeopathic success stories from Pt. Manohar Lal Sharma's legacy clinic.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CONTENT LISTING / EMPTY STATE SECTION */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            {mockCaseStudies.length === 0 ? (
              /* PREMIUM EMPTY STATE */
              <ScrollReveal direction="up" className="max-w-md mx-auto text-center bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-light/20 blur-2xl" />
                
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light/50 text-[#018ABE] flex items-center justify-center shadow-inner relative z-10">
                  <BookOpen size={32} />
                </div>
                
                <div className="space-y-2 relative z-10">
                  <h3 className="font-heading font-bold text-xl text-brand-dark">Case Studies Coming Soon</h3>
                  <p className="text-xs md:text-sm text-text-body/75 leading-relaxed">
                    Case studies will be published soon. Our medical writing team is compiling documented patient recoveries to share educational healthcare logs with you.
                  </p>
                </div>
                
                <div className="pt-4 relative z-10">
                  <a
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-white text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>Request Guidance</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </ScrollReveal>
            ) : (
              /* ACTIVE CASE STUDIES GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {mockCaseStudies.map((item, idx) => (
                  <ScrollReveal
                    key={item.id}
                    direction="up"
                    delay={idx * 150}
                    className="flex"
                  >
                    <div className="group bg-white rounded-[2rem] border border-slate-100/80 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col w-full relative">
                      <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100 shrink-0">
                        <Image
                          src={item.featuredImage}
                          alt={item.title}
                          fill
                          sizes="(max-w-768px) 100vw, 500px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark group-hover:text-brand-secondary transition-colors duration-300 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs md:text-sm text-text-body/85 leading-relaxed line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-text-body/70 font-semibold">
                            <Calendar size={13} className="text-[#018ABE]" /> {item.publishedDate}
                          </div>
                          
                          <Link 
                            href={`/case-studies/${item.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#018ABE] hover:text-brand-primary transition-colors group/link"
                          >
                            <span>Read Full Case</span>
                            <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
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
