"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Monitor scroll for adding shadows & micro-transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center w-full">
        {/* Logo Section - Visible only on mobile/tablet when BrandingSection is hidden or menu is compact */}
        <a href="#" className="flex items-center gap-3 shrink-0 lg:hidden">
          <div className="relative h-10 w-28 shrink-0">
            <Image
              src="/logo.jpg"
              alt="Homoeopathy4u Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
          <span className="font-heading font-bold text-[10px] min-[390px]:text-xs sm:text-sm text-brand-dark leading-tight tracking-tight shrink-0 border-l border-slate-200 pl-3 inline-block whitespace-nowrap">
            Narayan Homoeopathic
          </span>
        </a>

        {/* Desktop Navigation Link System - Centered on Desktop */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-xs xl:text-sm justify-center flex-grow mx-auto">
          <a
            href="/"
            className="text-brand-dark hover:text-brand-secondary transition-colors whitespace-nowrap"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap"
          >
            About Us
          </a>
          <a
            href="/treatments"
            className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap"
          >
            Our Treatments
          </a>
          <a
            href="/gallery"
            className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap"
          >
            Gallery
          </a>

          {/* Blog Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-brand-dark/80 hover:text-brand-secondary transition-colors focus:outline-none py-2 whitespace-nowrap"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span>Blog</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-0 w-48 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <a
                  href="/awards"
                  className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap"
                >
                  Awards
                </a>
                <a
                  href="/case-studies"
                  className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap"
                >
                  Case Studies
                </a>
                <a
                  href="/seminars"
                  className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap"
                >
                  Seminars
                </a>
              </div>
            )}
          </div>

          <a
            href="/#contact"
            className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap"
          >
            Contact Us
          </a>
        </nav>

        {/* CTA and Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="/booking"
            className="hidden sm:inline-flex bg-cta hover:bg-cta-hover text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-cta/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cta/50"
          >
            Book Appointment
          </a>

          {/* Hamburger button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-brand-dark p-2 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <a
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Home
          </a>
          <a
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            About Us
          </a>
          <a
            href="/treatments"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Our Treatments
          </a>
          <a
            href="/gallery"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Gallery
          </a>

          {/* Blog subgroup */}
          <div className="flex flex-col gap-2 pl-4 py-2 border-l-2 border-brand-light">
            <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider">
              Blog
            </span>
            <a
              href="/awards"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Awards
            </a>
            <a
              href="/case-studies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Case Studies
            </a>
            <a
              href="/seminars"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Seminars
            </a>
          </div>

          <a
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Contact Us
          </a>

          <a
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-cta hover:bg-cta-hover text-white text-center font-semibold py-3 rounded-xl transition-all duration-200 mt-2"
          >
            Book Appointment
          </a>
        </div>
      )}
    </header>
  );
}
