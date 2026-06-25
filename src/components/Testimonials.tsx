"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    text: "I admire your patience and dedication in spite of the long hours. Your commitment to this profession is truly commendable. Best doctor I have ever seen.",
    author: "Surudai Singh Brar",
    initials: "SB",
    relation: "Verified Patient",
  },
  {
    text: "The best homeopathic doctor in Roorkee. I have known him for 10 years. Punctual in time and provides excellent diagnosis. I give him 5 stars.",
    author: "D. Ram Kumar Giri",
    initials: "RG",
    relation: "Patient for 10 Years",
  },
  {
    text: "Really the best place to get the right homeopathic medicine, where you can rely upon a qualified and well-experienced homeopathic physician.",
    author: "Dr. Paul Madaan",
    initials: "PM",
    relation: "Medical Colleague, India",
  },
  {
    text: "The doctor is very good. He consults very well with patients and dedicates so much time to understanding their concerns.",
    author: "Utkarsh",
    initials: "U",
    relation: "Verified Patient",
  },
  {
    text: "It is the best homeopathic clinic. The diagnosis is perfect and Dr. Navneet Sharma provides highly satisfying treatment with a very high success rate.",
    author: "Prabhat Giri",
    initials: "PG",
    relation: "Verified Patient",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<() => void>(() => {});

  // Helper function to shift active index
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    if (isHovered) return;
    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };
    const interval = setInterval(play, 4000); // Shift every 4 seconds
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-dark leading-tight">
            Happy Patients
          </h2>
          <p className="text-cta font-heading font-medium text-base md:text-lg italic">
            Creating Vibrant Smiles for Healthy Lifestyles!
          </p>
        </div>

        {/* Carousel Visual Viewport */}
        <ScrollReveal direction="up" className="relative w-full max-w-3xl mx-auto">
          <div
            className="w-full select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Horizontal translate track container */}
            <div className="overflow-hidden py-4">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {testimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full shrink-0 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between min-h-[240px] group hover:-translate-y-1"
                  >
                    
                    {/* Background Quote Icon Accent */}
                    <Quote className="absolute right-6 top-6 text-brand-light/20 w-12 h-12 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                    
                    <div>
                      {/* Star Rating Grid */}
                      <div className="flex gap-1 mb-4 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-amber-500" />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="text-xs md:text-sm text-text-body/90 leading-relaxed italic mb-6">
                        "{item.text}"
                      </p>
                    </div>

                    {/* Author Profile bottom line */}
                    <div className="flex items-center gap-3.5 border-t border-slate-100 pt-4 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-sm text-brand-dark">
                          {item.author}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Pagination indicator dots */}
            <div className="flex justify-center items-center gap-2 mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "w-8 bg-brand-secondary" : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
