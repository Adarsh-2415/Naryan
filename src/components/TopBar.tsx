"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-brand-dark text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Contact info list */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
          <a
            href="tel:+911332270021"
            className="flex items-center gap-2 hover:text-brand-soft transition-colors"
          >
            <Phone size={14} className="text-brand-soft" />
            <span>+91-1332-270021</span>
          </a>
          <a
            href="mailto:homoeopathy4u@gmail.com"
            className="flex items-center gap-2 hover:text-brand-soft transition-colors"
          >
            <Mail size={14} className="text-brand-soft" />
            <span>homoeopathy4u@gmail.com</span>
          </a>
          <span className="flex items-center gap-2 text-white/90">
            <MapPin size={14} className="text-brand-soft" />
            <span>Roorkee, Haridwar UK</span>
          </span>
        </div>

        {/* Working Hours */}
        <div className="flex items-center gap-2 text-white/90">
          <Clock size={14} className="text-brand-soft" />
          <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
        </div>
      </div>
    </div>
  );
}
