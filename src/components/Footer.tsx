"use client";

import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function Footer() {
  const { settings } = useGlobalSettings();

  return (
    <footer className="bg-brand-dark text-white/70 text-sm border-t border-white/5 relative overflow-hidden">
      
      {/* Visual background gradient accent */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8 md:pt-20 md:pb-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-12">
          
          {/* Column 1: Logo & Clinic Info */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="relative h-12 w-40 bg-white p-1 rounded-xl border border-white/10 shrink-0">
                <Image
                  src="/logo.jpg"
                  alt={`${settings.clinic_name} Logo`}
                  fill
                  priority
                  className="object-contain object-left rounded-lg"
                />
              </div>
              <h3 className="font-heading font-bold text-sm text-white leading-tight pt-1">
                {settings.clinic_name}
              </h3>
            </div>
            
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              Providing patient-centric, gentle, and highly effective scientific homeopathic therapies in Roorkee. Empowering you toward long-term recovery and vitality.
            </p>
          </div>

          {/* Column 2: Contact Details */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Contact Details
            </h4>
            
            <ul className="space-y-3.5 text-xs text-white/60">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.address}
                </span>
              </li>
              
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-secondary shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-secondary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Find Us Google Map Embed */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Clinic Location Map
            </h4>
            
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/5 shadow-inner relative bg-slate-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3459.946462248469!2d77.8875836!3d29.865817800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb379db2d86af%3A0x319b1dd7a865c803!2sNarayan%20Homoeopathic%20Chikitsalaya%2F%20Narayan%20homoeopathy!5e0!3m2!1sen!2sin!4v1782294014957!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Footer Google Map Location"
                className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

        </div>

        {/* Footer Bottom Divider */}
        <div className="border-t border-white/5 pt-8 mt-8 text-center">
          <p className="text-xs text-white/60 font-medium tracking-wide">
            Copyright © 2026 <span className="text-white font-semibold">Homoeopathy4u</span> | Powered by <span className="text-emerald-400 font-semibold hover:underline cursor-pointer">FutureSoft India, Roorkee (+91 9045007799)</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
