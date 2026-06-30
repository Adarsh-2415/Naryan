"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Image as ImageIcon, 
  Award, 
  BookOpen, 
  Calendar, 
  Activity, 
  Settings, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  Check, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Menu, 
  Loader2,
  X,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

// Import public view templates for pixel-perfect previews
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ManagePagesPortal() {
  const [activeTab, setActiveTab] = useState<"gallery" | "awards" | "case-studies" | "seminars" | "treatments" | "global-settings">("gallery");
  const [items, setItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    clinic_name: "",
    phone: "",
    alternate_phone: "",
    email: "",
    address: "",
    office_hours: "",
    google_maps_url: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null); // Controls preview overlay modal
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Form states for items
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<any>({});
  const [uploadedImage, setUploadedImage] = useState<{ url: string; path: string } | null>(null);
  
  // Specific image fields for Case Studies
  const [uploadedBeforeImage, setUploadedBeforeImage] = useState<{ url: string; path: string } | null>(null);
  const [uploadedAfterImage, setUploadedAfterImage] = useState<{ url: string; path: string } | null>(null);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      if (!supabase) return fetch(url, options);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = {
        ...options.headers,
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      };
      return fetch(url, { ...options, headers });
    } catch (err) {
      console.error("Auth fetch failed:", err);
      return fetch(url, options);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setEditingId(null);
    setFormState({});
    setUploadedImage(null);
    setUploadedBeforeImage(null);
    setUploadedAfterImage(null);

    try {
      const res = await authFetch(`/api/admin/pages/${activeTab}`);
      const data = await res.json();
      if (data.success) {
        if (activeTab === "global-settings") {
          setSettings(data.settings || {
            clinic_name: "",
            phone: "",
            alternate_phone: "",
            email: "",
            address: "",
            office_hours: "",
            google_maps_url: ""
          });
        } else {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to load page content:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, authFetch]);

  // Load content whenever tab changes
  useEffect(() => {
    loadData();
  }, [loadData]);


  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "before" | "after" = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", activeTab);

    setSaving(true);
    try {
      const res = await authFetch("/api/admin/pages/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        const payload = { url: data.image_url, path: data.storage_path };
        if (field === "before") {
          setUploadedBeforeImage(payload);
          setFormState((prev: any) => ({ ...prev, before_image_url: data.image_url, before_image_storage_path: data.storage_path }));
        } else if (field === "after") {
          setUploadedAfterImage(payload);
          setFormState((prev: any) => ({ ...prev, after_image_url: data.image_url, after_image_storage_path: data.storage_path }));
        } else {
          setUploadedImage(payload);
          if (activeTab === "case-studies") {
            setFormState((prev: any) => ({ ...prev, cover_image_url: data.image_url, cover_image_storage_path: data.storage_path }));
          } else {
            setFormState((prev: any) => ({ ...prev, image_url: data.image_url, storage_path: data.storage_path }));
          }
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setSaving(false);
    }
  };

  // Save/Update Draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const isNew = !editingId;
      const method = isNew ? "POST" : "PUT";
      const url = isNew 
        ? `/api/admin/pages/${activeTab}` 
        : `/api/admin/pages/${activeTab}?id=${editingId}`;

      const payload = { ...formState, status: "draft" };
      
      // Inject display order automatically if new
      if (isNew && activeTab !== "global-settings") {
        payload.display_order = items.length;
      }

      // Handle treatments specific mappings
      if (activeTab === "treatments") {
        if (!payload.treatment_id) {
          payload.treatment_id = (payload.title || "").toLowerCase().replace(/\s+/g, "-");
        }
        if (!payload.icon_name) payload.icon_name = "Activity";
        if (!payload.icon_color_class) payload.icon_color_class = "text-blue-500 bg-blue-50";
        if (typeof payload.conditions === "string") {
          payload.conditions = payload.conditions.split("\n").map((c: string) => c.trim()).filter(Boolean);
        }
      }

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setFormState({});
        setUploadedImage(null);
        setUploadedBeforeImage(null);
        setUploadedAfterImage(null);
        await loadData();
      } else {
        alert(data.error || "Failed to save draft");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Publish Item (Changes status to published directly)
  const handlePublish = async (id: string, currentItem?: any) => {
    setSaving(true);
    try {
      const url = `/api/admin/pages/${activeTab}?id=${id}`;
      const payload = currentItem ? { ...currentItem, status: "published" } : { status: "published" };
      
      // Clean dynamic database objects if submitting whole object
      if (currentItem) {
        delete payload.id;
        delete payload.created_at;
        delete payload.updated_at;
      }

      const res = await authFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Unpublish Item (Changes status back to draft)
  const handleUnpublish = async (id: string, currentItem?: any) => {
    setSaving(true);
    try {
      const url = `/api/admin/pages/${activeTab}?id=${id}`;
      const payload = currentItem ? { ...currentItem, status: "draft" } : { status: "draft" };
      
      // Clean dynamic database objects if submitting whole object
      if (currentItem) {
        delete payload.id;
        delete payload.created_at;
        delete payload.updated_at;
      }

      const res = await authFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.error || "Failed to unpublish");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Archive Item (Changes status to archived directly)
  const handleArchive = async (id: string) => {
    setSaving(true);
    try {
      const url = `/api/admin/pages/${activeTab}?id=${id}`;
      const res = await authFetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" })
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this item? This will also remove the image file from storage.")) return;
    setSaving(true);
    try {
      const res = await authFetch(`/api/admin/pages/${activeTab}?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await authFetch("/api/admin/pages/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        alert("Global configuration settings updated!");
        await loadData();
      } else {
        alert(data.error || "Failed to update configuration");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;

    const list = [...items];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(targetIdx, 0, draggedItem);

    // Reassign indices
    const updatedList = list.map((item, idx) => ({
      ...item,
      display_order: idx
    }));

    setItems(updatedList);
    setDraggedIndex(null);

    // Sync database orders
    try {
      const reorderPayload = updatedList.map(item => ({
        id: item.id,
        display_order: item.display_order
      }));

      await authFetch(`/api/admin/pages/${activeTab}?action=reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderPayload)
      });
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  // Set form for editing
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormState(item);
    setUploadedImage({ url: item.image_url || item.cover_image_url, path: item.storage_path || item.cover_image_storage_path });
    if (item.before_image_url) setUploadedBeforeImage({ url: item.before_image_url, path: item.before_image_storage_path });
    if (item.after_image_url) setUploadedAfterImage({ url: item.after_image_url, path: item.after_image_storage_path });
  };

  // Form input helper
  const handleFormChange = (field: string, val: any) => {
    setFormState((prev: any) => ({ ...prev, [field]: val }));
  };

  // Static list of tab definitions
  const tabs = [
    { id: "gallery", name: "Gallery", icon: ImageIcon },
    { id: "awards", name: "Awards", icon: Award },
    { id: "case-studies", name: "Case Studies", icon: BookOpen },
    { id: "seminars", name: "Seminars", icon: Calendar },
    { id: "treatments", name: "Treatments", icon: Activity },
    { id: "global-settings", name: "Global Settings", icon: Settings }
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-heading font-bold text-2xl text-brand-dark">Manage Website Pages</h2>
          <p className="text-xs text-text-body/70 mt-1">Add, edit, rearrange and publish sections of your clinic's homepage.</p>
        </div>
        
        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#02457A] text-white shadow-md shadow-[#02457A]/10" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#018ABE]" />
        </div>
      ) : activeTab === "global-settings" ? (
        // Global Settings Form Layout
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-heading font-bold text-lg text-brand-dark flex items-center gap-2">
              <Settings size={18} className="text-[#018ABE]" />
              <span>Clinic Meta Settings</span>
            </h3>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-cta hover:bg-cta-hover disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save & Publish Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Clinic Name</label>
              <input
                type="text"
                value={settings.clinic_name || ""}
                onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Alternate Phone (Optional)</label>
              <input
                type="text"
                value={settings.alternate_phone || ""}
                onChange={(e) => setSettings({ ...settings, alternate_phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input
                type="text"
                value={settings.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Clinic Address</label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Office Hours</label>
              <input
                type="text"
                value={settings.office_hours || ""}
                onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Google Maps URL</label>
              <input
                type="text"
                value={settings.google_maps_url || ""}
                onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
      ) : (
        // Standard Module List (Gallery, Awards, Case Studies, Seminars, Treatments)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Editor */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit">
            <h3 className="font-heading font-bold text-lg text-brand-dark flex items-center justify-between pb-3 border-b border-slate-100">
              <span>{editingId ? "Edit Item" : "Add New Item"}</span>
              {editingId && (
                <button 
                  onClick={() => { setEditingId(null); setFormState({}); setUploadedImage(null); }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            <div className="space-y-4">
              {/* IMAGE UPLOAD ELEMENT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  {activeTab === "case-studies" ? "Cover Image" : "Image File"}
                </label>
                {uploadedImage ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 group">
                    <img src={uploadedImage.url} className="object-cover w-full h-full" alt="Preview" />
                    <button
                      onClick={() => { setUploadedImage(null); handleFormChange("image_url", ""); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-brand-secondary/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <span className="text-xs font-semibold text-slate-600">Click to Upload Image</span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPEG, WebP up to 5MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} />
                  </label>
                )}
              </div>

              {/* Title parameter (Not for gallery) */}
              {activeTab !== "gallery" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                  <input
                    type="text"
                    value={formState.title || ""}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                    placeholder="Enter item title..."
                  />
                </div>
              )}

              {/* Specific Case Studies Fields */}
              {activeTab === "case-studies" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Patient Condition</label>
                    <input
                      type="text"
                      value={formState.patient_condition || ""}
                      onChange={(e) => handleFormChange("patient_condition", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                      placeholder="e.g. Migraine, Asthma..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Short Summary (Excerpt)</label>
                    <textarea
                      value={formState.short_summary || ""}
                      onChange={(e) => handleFormChange("short_summary", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                      placeholder="Short excerpt for lists card..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Description (HTML Supported)</label>
                    <textarea
                      value={formState.full_description || ""}
                      onChange={(e) => handleFormChange("full_description", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-brand-primary"
                      placeholder="<h3>Background</h3><p>Patient details here...</p>"
                    />
                  </div>

                  {/* Before / After Optional Images */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Before Image (Optional)</label>
                      {uploadedBeforeImage ? (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={uploadedBeforeImage.url} className="object-cover w-full h-full" alt="Before" />
                          <button
                            onClick={() => { setUploadedBeforeImage(null); handleFormChange("before_image_url", ""); }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="text-slate-400 mb-1" size={14} />
                          <span className="text-[10px] text-slate-600">Upload Before</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "before")} />
                        </label>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">After Image (Optional)</label>
                      {uploadedAfterImage ? (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={uploadedAfterImage.url} className="object-cover w-full h-full" alt="After" />
                          <button
                            onClick={() => { setUploadedAfterImage(null); handleFormChange("after_image_url", ""); }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="text-slate-400 mb-1" size={14} />
                          <span className="text-[10px] text-slate-600">Upload After</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "after")} />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Seminars Short Description */}
              {activeTab === "seminars" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                  <textarea
                    value={formState.short_description || ""}
                    onChange={(e) => handleFormChange("short_description", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                    placeholder="Short description..."
                  />
                </div>
              )}

              {/* Treatments specific fields */}
              {activeTab === "treatments" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tag (Category)</label>
                    <input
                      type="text"
                      value={formState.tag || ""}
                      onChange={(e) => handleFormChange("tag", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                      placeholder="e.g. Cardiology, Gynaecology..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Icon Name (Lucide component)</label>
                    <select
                      value={formState.icon_name || "Activity"}
                      onChange={(e) => handleFormChange("icon_name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Heart">Heart (Cardiology)</option>
                      <option value="Baby">Baby (Pediatrics)</option>
                      <option value="Sparkles">Sparkles (Gynaecology)</option>
                      <option value="Brain">Brain (Neurology)</option>
                      <option value="Droplet">Droplet (Nephrology)</option>
                      <option value="Eye">Eye (Ophthalmology)</option>
                      <option value="Ear">Ear (Otology)</option>
                      <option value="Activity">Activity (General)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Icon Color Tailwind Classes</label>
                    <input
                      type="text"
                      value={formState.icon_color_class || ""}
                      onChange={(e) => handleFormChange("icon_color_class", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                      placeholder="e.g. text-red-500 bg-red-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Introduction</label>
                    <textarea
                      value={formState.intro || ""}
                      onChange={(e) => handleFormChange("intro", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                      placeholder="Brief intro..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Conditions Treated (One per line)</label>
                    <textarea
                      value={Array.isArray(formState.conditions) ? formState.conditions.join("\n") : formState.conditions || ""}
                      onChange={(e) => handleFormChange("conditions", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-brand-primary"
                      placeholder="Condition 1&#10;Condition 2"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Form actions: Save Draft, Preview and Publish workflow */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveDraft}
                disabled={saving || !uploadedImage}
                className="flex-1 flex items-center justify-center gap-2 bg-[#02457A] hover:bg-[#02457a]/90 text-white disabled:bg-slate-200 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                <span>Save Draft</span>
              </button>

              <button
                onClick={() => {
                  // Pre-load current draft content into preview overlay state
                  setPreviewItem({
                    ...formState,
                    image_url: uploadedImage?.url,
                    cover_image_url: uploadedImage?.url,
                    before_image_url: uploadedBeforeImage?.url,
                    after_image_url: uploadedAfterImage?.url
                  });
                }}
                disabled={!uploadedImage}
                className="flex items-center justify-center p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:bg-slate-50 disabled:text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="Preview layout"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Grid Listings with Drag and Drop order support */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-brand-dark flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Current Items</span>
              <span className="text-[10px] text-slate-400 tracking-tight font-normal">Drag handles to re-arrange items.</span>
            </h3>

            {items.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400">
                <ImageIcon size={28} className="mb-2" />
                <span className="text-xs">No records available. Create a draft to get started.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Drag icon */}
                      <Menu size={16} className="text-slate-400 shrink-0" />
                      
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                        <img 
                          src={item.image_url || item.cover_image_url} 
                          alt="Thumb" 
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-dark truncate">
                          {item.title || `Gallery Item #${item.display_order}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status === "published" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : item.status === "archived"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Order: {item.display_order}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions block */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.status !== "published" ? (
                        <button
                          onClick={() => handlePublish(item.id, item)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg transition-colors border border-emerald-200/50 cursor-pointer"
                          title="Publish live to website"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(item.id, item)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors border border-amber-200/50 cursor-pointer"
                          title="Unpublish (move to draft)"
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 hover:bg-blue-50 text-[#018ABE] rounded-lg"
                        title="Edit properties"
                      >
                        <LucideIcons.Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleArchive(item.id)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg"
                        title="Archive item"
                      >
                        <X size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* PIXEL-PERFECT PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8">
          
          {/* Header Controls */}
          <div className="w-full max-w-6xl bg-brand-dark text-white p-4 rounded-t-3xl flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-secondary animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase">Live CMS Preview (Pixel Perfect)</span>
            </div>
            <button
              onClick={() => setPreviewItem(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>

          {/* Sandbox Render Container - Reuses public components and layouts */}
          <div className="w-full max-w-6xl bg-slate-50 min-h-[80vh] rounded-b-3xl overflow-hidden border border-slate-200">
            <TopBar />
            <BrandingSection />
            <Navbar />

            {/* DYNAMIC COMPONENT INJECTION FOR PREVIEW */}
            <main className="flex-grow bg-slate-50/50 min-h-[50vh]">
              {activeTab === "gallery" && (
                <section className="py-16 md:py-24">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center">
                    <div className="w-full max-w-[550px]">
                      <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
                        <div className="aspect-[4/3] w-full relative bg-slate-100">
                          <img src={previewItem.image_url} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "awards" && (
                <section className="py-20 md:py-24 max-w-4xl mx-auto px-4">
                  <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl flex flex-col max-w-sm mx-auto">
                    <div className="aspect-[4/3] w-full relative bg-slate-100">
                      <img src={previewItem.image_url} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                    {previewItem.title && (
                      <div className="p-6">
                        <h3 className="font-heading font-bold text-lg text-brand-dark leading-snug">{previewItem.title}</h3>
                        <div className="pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs text-text-body/75 font-semibold mt-4">
                          <Calendar size={13} className="text-[#018ABE]" /> 2026
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "case-studies" && (
                <section className="py-12 md:py-20">
                  <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-4 mb-10">
                      {previewItem.patient_condition && (
                        <span className="inline-block text-xs font-bold text-[#018ABE] uppercase tracking-wider bg-brand-light/40 px-3 py-1.5 rounded-full">
                          {previewItem.patient_condition}
                        </span>
                      )}
                      <h1 className="font-heading font-bold text-3xl md:text-5xl text-brand-dark leading-tight tracking-tight">
                        {previewItem.title || "Untitled Recovery Case"}
                      </h1>
                    </div>

                    <div className="relative w-full aspect-[21/10] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 mb-12">
                      <img src={previewItem.cover_image_url} alt="Cover" className="object-cover w-full h-full" />
                    </div>

                    <div className="border-l-4 border-brand-secondary pl-6 mb-12">
                      <p className="text-base md:text-lg text-brand-dark/90 italic leading-relaxed">
                        {previewItem.short_summary || "No summary provided."}
                      </p>
                    </div>

                    <div className="prose prose-slate max-w-none mb-16 text-sm md:text-base leading-relaxed text-text-body/85 space-y-6">
                      <div dangerouslySetInnerHTML={{ __html: previewItem.full_description || "<p>No description provided.</p>" }} />
                    </div>

                    {(previewItem.before_image_url || previewItem.after_image_url) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {previewItem.before_image_url && (
                          <div className="space-y-3">
                            <h4 className="font-heading font-bold text-base text-brand-dark text-center">Before Treatment</h4>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-md">
                              <img src={previewItem.before_image_url} className="object-cover w-full h-full" alt="Before" />
                            </div>
                          </div>
                        )}
                        {previewItem.after_image_url && (
                          <div className="space-y-3">
                            <h4 className="font-heading font-bold text-base text-brand-dark text-center">After Treatment</h4>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-md">
                              <img src={previewItem.after_image_url} className="object-cover w-full h-full" alt="After" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "seminars" && (
                <section className="py-20 md:py-24 max-w-4xl mx-auto px-4">
                  <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl flex flex-col max-w-md mx-auto">
                    <div className="aspect-[16/10] w-full relative bg-slate-100">
                      <img src={previewItem.image_url} alt="Seminar" className="object-cover w-full h-full" />
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <h3 className="font-heading font-bold text-base md:text-lg text-brand-dark leading-snug">{previewItem.title || "Seminar Title"}</h3>
                      <p className="text-xs text-text-body/80 leading-relaxed">{previewItem.short_description || "Short description..."}</p>
                      <div className="pt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs text-[#018ABE] font-semibold mt-4">
                        <Calendar size={13} /> Feb 15, 2026
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "treatments" && (
                <section className="py-20 md:py-24 max-w-5xl mx-auto px-4">
                  <div className="group bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col max-w-sm mx-auto">
                    <div className="h-64 w-full relative bg-slate-50 shrink-0">
                      <img src={previewItem.image_url} alt="Treatment" className="object-cover w-full h-full" />
                      <span className="absolute top-4 left-4 bg-white/95 text-brand-dark font-heading text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
                        {previewItem.tag || "Therapeutics"}
                      </span>
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl shrink-0 ${previewItem.icon_color_class || "text-blue-500 bg-blue-50"}`}>
                          <Activity size={20} className="stroke-[2.5]" />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-brand-dark leading-snug">{previewItem.title || "Treatment Title"}</h3>
                      </div>
                      <p className="text-xs text-text-body/75 leading-relaxed">{previewItem.intro || "Introduction details..."}</p>
                    </div>
                  </div>
                </section>
              )}
            </main>

            <Footer />
          </div>

        </div>
      )}

    </div>
  );
}
