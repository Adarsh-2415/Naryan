"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function TopBar() {
  const { settings } = useGlobalSettings();

  return (
    <div className="bg-brand-dark text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Contact info list */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
          <a
            href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-2 hover:text-brand-soft transition-colors"
          >
            <Phone size={14} className="text-brand-soft" />
            <span>{settings.phone}</span>
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center gap-2 hover:text-brand-soft transition-colors"
          >
            <Mail size={14} className="text-brand-soft" />
            <span>{settings.email}</span>
          </a>
          <span className="flex items-center gap-2 text-white/90">
            <MapPin size={14} className="text-brand-soft" />
            <span className="truncate max-w-[250px]" title={settings.address}>
              {settings.address}
            </span>
          </span>
        </div>

        {/* Working Hours */}
        <div className="flex items-center gap-2 text-white/90">
          <Clock size={14} className="text-brand-soft" />
          <span>{settings.office_hours}</span>
        </div>
      </div>
    </div>
  );
}
