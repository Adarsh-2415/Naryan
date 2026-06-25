"use client";

import { Phone, ShieldCheck, Sparkles, Clock, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function QuickBooking() {
  const handleDial = () => {
    window.location.href = "tel:+911332270021";
  };

  return (
    <section id="booking" className="relative overflow-hidden bg-slate-50 border-b border-slate-100 py-16 md:py-24">
      
      {/* Injecting CSS Keyframe for the Wiggle/Ringing animation */}
      <style jsx global>{`
        @keyframes phoneWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-15deg) scale(1.1); }
          20%, 40%, 60%, 80% { transform: rotate(15deg) scale(1.1); }
        }
        .group:hover .animate-wiggle-ring {
          animation: phoneWiggle 0.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Visual Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Info Content */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="left" className="space-y-4">
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                New Patient can book appointment
              </h2>
              <p className="text-text-body/80 text-sm md:text-base leading-relaxed">
                Patients can book an appointment at Narayan Homoeopathic Chikitsalaya by calling the clinic, visiting the website, or booking online. Our staff will assist with scheduling at your convenience.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={150} className="pt-6 border-t border-slate-200">
              <span className="text-xs font-bold tracking-wider text-brand-dark/60 uppercase block">
                Need Assistance?
              </span>
              <a
                href="tel:+911332270021"
                className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold font-heading text-brand-secondary hover:text-brand-primary transition-colors mt-2"
              >
                <Phone size={24} className="animate-pulse text-emerald-500" />
                <span>+91-1332 270021</span>
              </a>
            </ScrollReveal>
          </div>

          {/* Right Column: 3D Ringing Helpline Terminal */}
          <div className="lg:col-span-6 flex justify-center relative w-full" style={{ perspective: "1000px" }}>
            
            {/* Dotted Accent Vector */}
            <div className="absolute -top-8 -left-8 pointer-events-none opacity-30 -z-10">
              <svg width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" fill="#02457A" />
                  </pattern>
                </defs>
                <rect width="120" height="120" fill="url(#dot-grid)" />
              </svg>
            </div>

            {/* 3D Isometric Card Console */}
            <ScrollReveal direction="right" className="w-full max-w-[440px] flex justify-center">
              <div 
                className="group w-full bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-100/90 p-6 md:p-8 transform transition-all duration-500 hover:rotate-y-12 hover:-rotate-x-6 hover:scale-103 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                onClick={handleDial}
              >
                
                {/* 3D Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6" style={{ transform: "translateZ(40px)" }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-50 text-emerald-600 rounded-xl">
                      <Phone size={22} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-brand-dark">Helpline Terminal</h3>
                      <p className="text-[10px] font-semibold text-emerald-500 tracking-wider uppercase flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        Live Connection Desk
                      </p>
                    </div>
                  </div>
                  <Sparkles size={16} className="text-brand-secondary animate-pulse" />
                </div>

                {/* Animated 3D Ringing Sphere Desk */}
                <div className="relative w-full h-44 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden mb-6" style={{ transform: "translateZ(30px)" }}>
                  
                  {/* Concentric Pulse Rings */}
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/25 animate-ping duration-1000" />
                  <div className="absolute w-36 h-36 rounded-full bg-emerald-500/5 border border-emerald-500/10 animate-ping duration-1000 delay-300" />
                  
                  {/* Green glowing core */}
                  <div className="absolute w-20 h-20 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-full blur-xl opacity-30 animate-pulse" />

                  {/* Core Floating phone circle */}
                  <div className="relative z-10 w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white/20 transform duration-300 group-hover:scale-105">
                    <Phone className="text-white animate-wiggle-ring" size={32} />
                  </div>

                  {/* Ringing label banner */}
                  <div className="absolute bottom-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/90 font-semibold uppercase tracking-wider border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Hover to Ring Desk
                  </div>

                </div>

                {/* Status Bar */}
                <div className="bg-slate-100/50 rounded-xl p-3.5 text-[11px] text-text-body/80 border border-slate-200/50 flex flex-col gap-2 mb-6" style={{ transform: "translateZ(15px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-dark flex items-center gap-1.5">
                      <Clock size={12} className="text-[#018ABE]" />
                      Response Time: &lt; 2 Mins
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <ShieldCheck size={12} />
                      Priority Queue
                    </span>
                  </div>
                  <p className="text-[10px] text-text-body/60 leading-tight">
                    Direct helpline avoids typing mistakes. Click anywhere on this card to place an instant call.
                  </p>
                </div>

                {/* Dial CTA Button */}
                <button
                  type="button"
                  onClick={handleDial}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold font-heading py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 flex items-center justify-center gap-2 group cursor-pointer text-xs sm:text-sm"
                  style={{ transform: "translateZ(45px)" }}
                >
                  <span>CALL CLINIC HELPLINE</span>
                  <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
}
