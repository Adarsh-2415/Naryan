"use client";

import { useState, useEffect } from "react";
import {
  Settings, Save, Globe, Phone, Mail, MapPin, Share2,
  BarChart2, Search, Loader2, Check, AlertCircle,
  ExternalLink, Link2, RefreshCw
} from "lucide-react";

interface SeoConfig {
  id: string;
  site_name: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_address: string;
  google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  linkedin_url: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
  google_search_console_verification: string;
}

const EMPTY_CONFIG: SeoConfig = {
  id: "",
  site_name: "Narayan Homoeopathic Chikitsalaya",
  meta_title: "",
  meta_description: "",
  og_image_url: "",
  clinic_phone: "",
  clinic_email: "",
  clinic_address: "",
  google_maps_url: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  linkedin_url: "",
  google_analytics_id: "",
  google_tag_manager_id: "",
  google_search_console_verification: "",
};

type SaveState = "idle" | "saving" | "saved" | "error";

function SectionCard({ icon: Icon, title, color, children }: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100" style={{ backgroundColor: `${color}08` }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#018ABE]/30 focus:border-[#018ABE] transition-all placeholder:text-slate-300";

export default function GlobalSettingsPage() {
  const [config, setConfig] = useState<SeoConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch current config
  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seo");
      const json = await res.json();
      if (json.success && json.config) {
        setConfig({
          ...EMPTY_CONFIG,
          ...Object.fromEntries(
            Object.entries(json.config).map(([k, v]) => [k, v ?? ""])
          ),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const set = (field: keyof SeoConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig((prev) => ({ ...prev, [field]: e.target.value }));
    setSaveState("idle");
  };

  const save = async () => {
    setSaveState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: config.site_name,
          metaTitle: config.meta_title,
          metaDescription: config.meta_description,
          ogImageUrl: config.og_image_url,
          clinicPhone: config.clinic_phone,
          clinicEmail: config.clinic_email,
          clinicAddress: config.clinic_address,
          googleMapsUrl: config.google_maps_url,
          facebookUrl: config.facebook_url,
          instagramUrl: config.instagram_url,
          youtubeUrl: config.youtube_url,
          linkedinUrl: config.linkedin_url,
          googleAnalyticsId: config.google_analytics_id,
          googleTagManagerId: config.google_tag_manager_id,
          googleSearchConsoleVerification: config.google_search_console_verification,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveState("saved");
        if (json.config) setConfig({ ...EMPTY_CONFIG, ...Object.fromEntries(Object.entries(json.config).map(([k, v]) => [k, v ?? ""])) });
        setTimeout(() => setSaveState("idle"), 3000);
      } else {
        setSaveState("error");
        setErrorMsg(json.error || "Failed to save settings");
      }
    } catch (e: any) {
      setSaveState("error");
      setErrorMsg(e.message || "Network error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#018ABE] mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading global settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Clinic details, SEO configuration, social media, and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadConfig}
            className="inline-flex items-center gap-2 text-slate-600 border border-slate-200 hover:bg-slate-50 text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={save}
            disabled={saveState === "saving"}
            className="inline-flex items-center gap-2 bg-[#018ABE] hover:bg-[#0173a0] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Settings
          </button>
        </div>
      </div>

      {/* Save feedback */}
      {saveState === "saved" && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          <Check className="h-4 w-4 shrink-0" />
          Settings saved successfully!
        </div>
      )}
      {saveState === "error" && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── SEO & Site Identity ─────────────────────────────── */}
      <SectionCard icon={Globe} title="Site Identity & SEO" color="#018ABE">
        <Field label="Site Name">
          <input type="text" value={config.site_name} onChange={set("site_name")} className={inputClass} placeholder="Narayan Homoeopathic Chikitsalaya" />
        </Field>
        <Field label="Meta Title" hint="Appears in browser tab and Google search results. Keep under 60 characters.">
          <input type="text" value={config.meta_title} onChange={set("meta_title")} className={inputClass} placeholder="Narayan Homoeopathic Chikitsalaya | Roorkee" />
          <div className="flex justify-end mt-1">
            <span className={`text-xs font-semibold ${config.meta_title.length > 60 ? "text-red-500" : "text-slate-400"}`}>
              {config.meta_title.length}/60
            </span>
          </div>
        </Field>
        <Field label="Meta Description" hint="Shown in search engine snippets. Keep under 160 characters.">
          <textarea
            value={config.meta_description}
            onChange={set("meta_description")}
            rows={3}
            className={inputClass}
            placeholder="Constitutional homeopathy consultations at Narayan Clinic, Roorkee…"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs font-semibold ${config.meta_description.length > 160 ? "text-red-500" : "text-slate-400"}`}>
              {config.meta_description.length}/160
            </span>
          </div>
        </Field>
        <Field label="OG Image URL" hint="Open Graph image shown when pages are shared on social media (1200×630px recommended).">
          <input type="url" value={config.og_image_url} onChange={set("og_image_url")} className={inputClass} placeholder="https://…/og-image.jpg" />
        </Field>
      </SectionCard>

      {/* ── Clinic Contact Details ──────────────────────────── */}
      <SectionCard icon={Phone} title="Clinic Contact Details" color="#22c55e">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="tel" value={config.clinic_phone} onChange={set("clinic_phone")} className={`${inputClass} pl-10`} placeholder="+91-1332 270021" />
            </div>
          </Field>
          <Field label="Email Address">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="email" value={config.clinic_email} onChange={set("clinic_email")} className={`${inputClass} pl-10`} placeholder="homoeopathy4u@gmail.com" />
            </div>
          </Field>
        </div>
        <Field label="Clinic Address">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              value={config.clinic_address}
              onChange={set("clinic_address")}
              rows={2}
              className={`${inputClass} pl-10 resize-none`}
              placeholder="First street, Neelam cinema crossing 32, Civil Lines, Roorkee…"
            />
          </div>
        </Field>
        <Field label="Google Maps URL" hint="Paste the full Google Maps link to your clinic location.">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="url" value={config.google_maps_url} onChange={set("google_maps_url")} className={`${inputClass} pl-10`} placeholder="https://maps.google.com/?q=…" />
          </div>
        </Field>
      </SectionCard>

      {/* ── Social Media ────────────────────────────────────── */}
      <SectionCard icon={Share2} title="Social Media Links" color="#8b5cf6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Facebook">
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
              <input type="url" value={config.facebook_url} onChange={set("facebook_url")} className={`${inputClass} pl-10`} placeholder="https://facebook.com/…" />
            </div>
          </Field>
          <Field label="Instagram">
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
              <input type="url" value={config.instagram_url} onChange={set("instagram_url")} className={`${inputClass} pl-10`} placeholder="https://instagram.com/…" />
            </div>
          </Field>
          <Field label="YouTube">
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
              <input type="url" value={config.youtube_url} onChange={set("youtube_url")} className={`${inputClass} pl-10`} placeholder="https://youtube.com/@…" />
            </div>
          </Field>
          <Field label="LinkedIn">
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              <input type="url" value={config.linkedin_url} onChange={set("linkedin_url")} className={`${inputClass} pl-10`} placeholder="https://linkedin.com/…" />
            </div>
          </Field>
        </div>
      </SectionCard>

      {/* ── Analytics & Tracking ────────────────────────────── */}
      <SectionCard icon={BarChart2} title="Analytics & Tracking" color="#f59e0b">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Google Analytics ID" hint="Format: G-XXXXXXXXXX">
            <input type="text" value={config.google_analytics_id} onChange={set("google_analytics_id")} className={inputClass} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Google Tag Manager ID" hint="Format: GTM-XXXXXXX">
            <input type="text" value={config.google_tag_manager_id} onChange={set("google_tag_manager_id")} className={inputClass} placeholder="GTM-XXXXXXX" />
          </Field>
        </div>
        <Field label="Google Search Console Verification" hint="HTML meta tag content value from Search Console verification.">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={config.google_search_console_verification}
              onChange={set("google_search_console_verification")}
              className={`${inputClass} pl-10`}
              placeholder="Paste verification code here…"
            />
          </div>
        </Field>
      </SectionCard>

      {/* Bottom save button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={save}
          disabled={saveState === "saving"}
          className="inline-flex items-center gap-2 bg-[#018ABE] hover:bg-[#0173a0] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer shadow-lg shadow-[#018ABE]/20"
        >
          {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Settings
        </button>
      </div>
    </div>
  );
}
