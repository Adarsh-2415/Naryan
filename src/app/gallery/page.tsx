"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Eye, X, ZoomIn, Calendar, MapPin, Award } from "lucide-react";

// Initial gallery items (can be extended through CMS later)
const galleryItems = [
  {
    id: 1,
    image: "/gallery-main.jpg",
    title: "Gallery Main Image"
  }
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <TopBar />
      <BrandingSection />
      <Navbar />

      <main className="flex-grow bg-slate-50/50">
        
        {/* HERO BANNER SECTION - IMAGE ONLY */}
        <section className="relative w-full overflow-hidden border-b border-slate-100 bg-slate-50">
          <div className="w-full relative aspect-[21/9] md:aspect-[3/1] max-h-[450px]">
            <Image
              src="/gallery-banner.png"
              alt="Gallery Banner"
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        </section>

        {/* GALLERY PHOTO GRID */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center">
            <ScrollReveal direction="up" className="w-full max-w-[550px]">
              <div 
                onClick={() => setSelectedImage("/gallery-main.jpg")}
                className="group bg-white rounded-3xl border border-slate-100/80 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer relative"
              >
                {/* Image frame */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                  <Image
                    src="/gallery-main.jpg"
                    alt="Gallery Main Image"
                    fill
                    sizes="(max-w-768px) 100vw, 550px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-brand-dark flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                      <ZoomIn size={20} className="stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/80 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              onClick={() => setSelectedImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>
            
            <div 
              className="relative max-w-4xl w-full aspect-auto max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-auto max-h-[85vh] object-contain mx-auto rounded-xl border border-white/10"
              />
            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
