"use client";

import Image from "next/image";

export default function BrandingSection() {
  return (
    <div className="bg-white py-6 px-4 md:px-8 border-b border-slate-100 hidden sm:block">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center md:text-left">
        
        {/* Large Clinic Logo Container */}
        <a href="#" className="relative h-20 w-64 md:w-72 shrink-0 block transition-transform duration-300 hover:scale-101">
          <Image
            src="/logo.jpg"
            alt="Narayan Homoeopathic Chikitsalaya Logo"
            fill
            priority
            className="object-contain object-center md:object-left"
          />
        </a>

        {/* Vertical divider line */}
        <div className="h-12 w-px bg-slate-200 shrink-0 hidden md:block" />

        {/* Prominent Clinic Title */}
        <div className="hidden md:block">
          <h1 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-dark leading-none tracking-tight text-center md:text-left">
            Narayan Homoeopathic Chikitsalaya
          </h1>
        </div>

      </div>
    </div>
  );
}
