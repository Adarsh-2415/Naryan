"use client";

import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight, BookOpen, Clock, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useParams } from "next/navigation";

// Local dataset simulating Sanity CMS document payload
const mockCasesData: Record<string, any> = {
  "chronic-allergic-asthma-recovery": {
    title: "Recovery from Chronic Allergic Asthma in Children",
    category: "Pediatric Respiratory Care",
    publishedDate: "June 25, 2026",
    readTime: "6 min read",
    featuredImage: "/infant.png",
    intro: "A documented case study outlining the constitutional homeopathic treatment pathway that successfully cured severe, recurring respiratory distress in an 18-month old infant.",
    sections: [
      {
        heading: "Patient Background & Anamnesis",
        text: "The patient, an 18-month-old infant, presented with recurrent episodes of wheezing, respiratory distress, and dry spasmodic cough that worsened during seasonal changes and at night. Standard inhaler treatments provided only temporary relief, and the parents sought a safe, permanent alternative."
      },
      {
        heading: "Constitutional Diagnosis",
        text: "Homeopathic diagnosis prioritizes the physical, mental, and constitutional makeup of the individual. After analyzing the patient's strong perspiration patterns, thermal preferences, and family history of respiratory hypersensitivity, a highly individualized constitutional remedy was selected."
      },
      {
        heading: "Treatment & Dosage Timeline",
        text: "The patient was prescribed the constitutional remedy in varying potencies over a period of 4 months. In the first 3 weeks, the severity and frequency of night-time spasms declined by 50%. The dosage was adjusted to support immune resilience as seasonal changes approached."
      },
      {
        heading: "Clinical Outcome & Follow-Up",
        text: "By month 4, the wheezing had completely resolved, and standard clinical diagnostics confirmed normal lungs with zero airway inflammation. Over the subsequent 12-month follow-up period, the patient experienced zero recurrences, fully thriving without any bronchial medications."
      }
    ]
  }
};

export default function SingleCaseStudyPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "chronic-allergic-asthma-recovery";
  
  // Find case study by slug, fallback to mock data
  const caseData = mockCasesData[slug] || mockCasesData["chronic-allergic-asthma-recovery"];

  return (
    <>
      <TopBar />
      <BrandingSection />
      <Navbar />

      <main className="flex-grow bg-slate-50/50">
        
        {/* BREADCRUMB STRIP */}
        <section className="py-4 bg-white border-b border-slate-100 relative z-10">
          <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 text-xs text-text-body/70 font-medium">
            <Link href="/" className="hover:text-brand-secondary transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/case-studies" className="hover:text-brand-secondary transition-colors">Case Studies</Link>
            <ChevronRight size={10} />
            <span className="text-brand-dark truncate">{caseData.title}</span>
          </div>
        </section>

        {/* CASE STUDY CONTENT WRAPPER */}
        <section className="py-12 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/case-studies" 
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors group"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                <span>BACK TO CASE STUDIES</span>
              </Link>
            </div>

            {/* Header Content */}
            <div className="space-y-4 mb-10">
              <span className="inline-block text-xs font-bold text-[#018ABE] uppercase tracking-wider bg-brand-light/40 px-3 py-1.5 rounded-full">
                {caseData.category}
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                {caseData.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-text-body/75 font-semibold pt-2 border-b border-slate-100 pb-6">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#018ABE]" /> {caseData.publishedDate}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#018ABE]" /> {caseData.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full aspect-[21/10] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 mb-12">
              <Image
                src={caseData.featuredImage}
                alt={caseData.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Intro excerpt */}
            <div className="border-l-4 border-brand-secondary pl-6 mb-12">
              <p className="text-base md:text-lg text-brand-dark/90 italic leading-relaxed">
                {caseData.intro}
              </p>
            </div>

            {/* Structured Sections */}
            <div className="space-y-12 mb-16">
              {caseData.sections.map((sec: any, idx: number) => (
                <ScrollReveal key={idx} direction="up" className="space-y-3">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">
                    {sec.heading}
                  </h2>
                  <p className="text-sm md:text-base text-text-body/85 leading-relaxed">
                    {sec.text}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            {/* BOOK APPOINTMENT CTA BANNER */}
            <ScrollReveal direction="up" className="bg-gradient-to-br from-[#02457A] to-[#018ABE] text-white rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white">
                  Looking for a Safe, Constitutional Treatment?
                </h3>
                <p className="text-brand-light/90 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                  We specialize in pediatric, cardiovascular, and gynecological homeopathic pathways. Schedule a comprehensive diagnostic call with our senior consultants today.
                </p>
                <div className="flex justify-center pt-2">
                  <a
                    href="/booking"
                    className="bg-white text-brand-dark hover:bg-slate-50 font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg flex items-center gap-2 group hover:scale-[1.02] transform text-xs"
                  >
                    <span>Schedule Appointment</span>
                    <ArrowRight size={15} className="text-[#018ABE]" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
