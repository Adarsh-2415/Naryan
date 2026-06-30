import { useState, useEffect } from "react";

export interface GlobalSettings {
  clinic_name: string;
  phone: string;
  alternate_phone: string;
  email: string;
  address: string;
  office_hours: string;
  google_maps_url: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  clinic_name: "Narayan Homoeopathic Chikitsalaya",
  phone: "+91-1332 270021",
  alternate_phone: "",
  email: "homoeopathy4u@gmail.com",
  address: "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667",
  office_hours: "Mon - Sat: 09:00 AM - 05:00 PM",
  google_maps_url: "https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee"
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/pages/global-settings")
      .then(res => res.json())
      .then(data => {
        if (active && data?.success && data?.settings) {
          setSettings({
            clinic_name: data.settings.clinic_name || DEFAULT_SETTINGS.clinic_name,
            phone: data.settings.phone || DEFAULT_SETTINGS.phone,
            alternate_phone: data.settings.alternate_phone || DEFAULT_SETTINGS.alternate_phone,
            email: data.settings.email || DEFAULT_SETTINGS.email,
            address: data.settings.address || DEFAULT_SETTINGS.address,
            office_hours: data.settings.office_hours || DEFAULT_SETTINGS.office_hours,
            google_maps_url: data.settings.google_maps_url || DEFAULT_SETTINGS.google_maps_url
          });
        }
      })
      .catch(err => {
        console.warn("Could not load database settings, utilizing local fallbacks:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}
