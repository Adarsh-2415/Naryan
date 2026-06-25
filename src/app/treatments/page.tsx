"use client";

import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Heart, Baby, Sparkles, ArrowRight, Activity, Check, Brain, Droplet, Eye, Ear, Calendar } from "lucide-react";

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
  },
  {
    id: "child-disabilities",
    title: "Child Disabilities",
    tag: "Pediatrics / Neurology",
    icon: Brain,
    iconColor: "text-indigo-500 bg-indigo-50",
    image: "/child-disabilities.jpg",
    intro: "Supportive developmental care and constitutional homeopathy to help children thrive despite neurological and sensory challenges.",
    conditions: [
      "Support for children with Mental Retardation",
      "Cerebral Palsy management support",
      "Sensory impairments including Blindness",
      "Childhood depression & emotional struggles"
    ]
  },
  {
    id: "renal-disorders",
    title: "Renal Disorders",
    tag: "Nephrology",
    icon: Droplet,
    iconColor: "text-blue-500 bg-blue-50",
    image: "/renal-disorders.png",
    intro: "Natural clinical support aimed at protecting renal tissue, assisting in stone clearance, and easing urinary discomfort.",
    conditions: [
      "Kidney diseases & inflammatory states",
      "Kidney stones (Renal calculi) clearance assistance",
      "Burning sensation during urination (Dysuria)",
      "Urinary tract bleeding (Hematuria)",
      "Supportive therapeutics for kidney failure"
    ]
  },
  {
    id: "eyes-treatment",
    title: "Eyes Treatment",
    tag: "Ophthalmology",
    icon: Eye,
    iconColor: "text-teal-500 bg-teal-50",
    image: "/eyes-treatment.png",
    intro: "Gentle natural formulations designed to address ocular strain, recurrent eye infections, and chronic tear duct issues.",
    conditions: [
      "Chronic eye diseases & ocular strain",
      "Supportive care in early-stage Cataracts",
      "Frequent watering of eyes (Epiphora)",
      "Eye infections & Conjunctivitis support",
      "Ocular pain & dry eye syndrome relief"
    ]
  },
  {
    id: "ear-treatment",
    title: "Ear Treatment",
    tag: "Otology",
    icon: Ear,
    iconColor: "text-orange-500 bg-orange-50",
    image: "/ear-treatment.png",
    intro: "Focused homeopathic treatments targeting eardrum congestion, middle-ear fluid, and sound sensitivity.",
    conditions: [
      "Chronic ear discharge (Otitis media)",
      "Hearing loss & partial deafness support",
      "Eardrum congestion & middle-ear disorders"
    ]
  },
  {
    id: "gastrointestinal",
    title: "Gastrointestinal Diseases",
    tag: "Gastroenterology",
    icon: Activity,
    iconColor: "text-emerald-500 bg-emerald-50",
    image: "/gastrointestinal.png",
    intro: "Comprehensive homeopathic therapeutics targeting digestion, gut motility, intestinal health, and hepatic enzymes.",
    conditions: [
      "Disorders of the stomach, liver, and intestines",
      "Colitis & inflammatory bowel symptoms",
      "Hepatomegaly (Enlargement of the liver)",
      "Intestinal infections & malabsorption syndrome"
    ]
  }
];

export default function TreatmentsPage() {
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
                <pattern id="treatments-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#treatments-grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <ScrollReveal direction="up" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs tracking-wide shadow-sm uppercase border border-brand-soft/20 w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                Clinical Specialities
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                  Targeted{" "}
                  <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent">
                    Homeopathic Treatments
                  </span>
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200}>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  Addressing chronic and acute disorders at their roots. We provide highly individualized, scientific homeopathic solutions aimed at long-lasting recovery and absolute safety.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* TREATMENTS GRID */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </section>

        {/* BOOK APPOINTMENT CALLOUT BANNER - REDESIGNED & TREATMENT-FOCUSED */}
        <section className="pb-20 md:pb-28 bg-white relative z-10">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <ScrollReveal direction="up" className="relative bg-gradient-to-br from-[#02457A] to-[#018ABE] text-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 lg:p-16 border border-white/15">
              
              {/* Premium Glow Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cta/15 blur-3xl pointer-events-none" />
              
              {/* Geometric pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
                
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-4 text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-brand-light font-semibold text-xs tracking-wider uppercase border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light" />
                    Personalized Clinical Guidance
                  </span>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                    Not Sure Which Treatment is Right for You?
                  </h2>
                  <p className="text-brand-light/90 text-sm md:text-base leading-relaxed max-w-2xl">
                    Every body is unique. Our senior homeopathic consultants analyze your clinical history to formulate a tailored, constitutional health plan. Schedule a call to discuss your symptoms.
                  </p>
                </div>

                {/* Right Column: CTA Button */}
                <div className="lg:col-span-4 flex lg:justify-end">
                  <a
                    href="/booking"
                    className="bg-white hover:bg-slate-50 text-[#02457A] font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-xl flex items-center gap-2 group hover:scale-[1.02] transform w-full sm:w-auto justify-center text-center"
                  >
                    <span>Book Appointment</span>
                    <Calendar size={18} className="text-brand-secondary transition-transform duration-300 group-hover:rotate-6" />
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
