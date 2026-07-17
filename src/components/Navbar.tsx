"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <Link href="/" className="flex items-center gap-3 shrink-0 lg:hidden">
          <div className="relative h-10 w-28 shrink-0">
            <Image
              src="/logo.jpg"
              alt="Homoeopathy4u Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
          <div className="flex flex-col border-l border-slate-200 pl-2 sm:pl-3">
            <span className="font-heading font-bold text-[10px] min-[390px]:text-[11px] sm:text-xs text-[#3F3C94] leading-tight">
              नारायण होम्योपैथिक चिकित्सालय
            </span>
            <span className="font-heading font-bold text-[8px] min-[390px]:text-[9px] sm:text-[10px] text-[#3F3C94] leading-tight mt-0.5">
              Narayan Homoeopathic Chikitsalaya
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Link System - Centered and constrained to align with Logo/Title above */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-[950px] mx-auto">
          <nav className="flex items-center gap-6 xl:gap-8 font-medium text-xs xl:text-sm">
            <Link href="/" className="text-brand-dark hover:text-brand-secondary transition-colors whitespace-nowrap">Home</Link>
            <Link href="/about" className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap">About Us</Link>
            <Link href="/treatments" className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap">Our Treatments</Link>
            <Link href="/gallery" className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap">Gallery</Link>

            {/* Blog Dropdown */}
            <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className="flex items-center gap-1 text-brand-dark/80 hover:text-brand-secondary transition-colors focus:outline-none py-2 whitespace-nowrap" aria-expanded={isDropdownOpen} aria-haspopup="true">
                <span>Blog</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-0 w-48 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link href="/awards" className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap">Awards</Link>
                  <Link href="/case-studies" className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap">Case Studies</Link>
                  <Link href="/seminars" className="block px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-slate-50 hover:text-brand-secondary transition-colors whitespace-nowrap">Seminars</Link>
                </div>
              )}
            </div>

            <Link href="/#contact" className="text-brand-dark/80 hover:text-brand-secondary transition-colors whitespace-nowrap">Contact Us</Link>
          </nav>

          {/* Desktop CTA */}
          <Link href="/booking" className="bg-cta hover:bg-cta-hover text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-cta/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cta/50">
            Book Appointment
          </Link>
        </div>

        {/* Mobile CTA and Toggle (Visible only on smaller screens) */}
        <div className="flex lg:hidden items-center gap-4 ml-auto">
          <Link href="/booking" className="hidden sm:inline-flex bg-cta hover:bg-cta-hover text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-cta/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cta/50">
            Book
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-dark p-2 hover:bg-slate-100 rounded-lg focus:outline-none" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            About Us
          </Link>
          <Link
            href="/treatments"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Our Treatments
          </Link>
          <Link
            href="/gallery"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Gallery
          </Link>

          {/* Blog subgroup */}
          <div className="flex flex-col gap-2 pl-4 py-2 border-l-2 border-brand-light">
            <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider">
              Blog
            </span>
            <Link
              href="/awards"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Awards
            </Link>
            <Link
              href="/case-studies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Case Studies
            </Link>
            <Link
              href="/seminars"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-dark/80 hover:text-brand-secondary py-1"
            >
              Seminars
            </Link>
          </div>

          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-brand-dark/85 hover:text-brand-secondary py-2 border-b border-slate-50"
          >
            Contact Us
          </Link>

          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-cta hover:bg-cta-hover text-white text-center font-semibold py-3 rounded-xl transition-all duration-200 mt-2"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}
