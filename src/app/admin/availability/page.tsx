"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  ToggleLeft, 
  ToggleRight,
  Info,
  CalendarCheck,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BookingCalendar from "@/components/BookingCalendar";

import { BASE_SLOTS, getDefaultLunchSlots } from "@/lib/bookingConfig";

// Helper functions for time conversions
function convert24to12(time24h: string): string {
  if (!time24h) return "";
  const [hoursStr, minutesStr] = time24h.split(":");
  let hours = parseInt(hoursStr, 10);
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutesStr} ${modifier}`;
}

function convert12to24(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return `${hours.toString().padStart(2, "0")}:${minutesStr}:00`;
}

function timeToMinutes(timeStr: string): number {
  const [time, modifier] = timeStr.split(" ");
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return hours * 60 + minutes;
}

function timeToMinutes24(time24h: string): number {
  const [hoursStr, minutesStr] = time24h.split(":");
  return parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
}

export default function AvailabilityManagement() {
  const [activeTab, setActiveTab] = useState<"holidays" | "blocked-dates" | "blocked-slots" | "lunch-overrides">("holidays");
  
  // Data lists
  const [holidays, setHolidays] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [lunchOverrides, setLunchOverrides] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Edit mode tracking
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");
  
  const [blockedDateVal, setBlockedDateVal] = useState("");
  const [blockedDateReason, setBlockedDateReason] = useState("");
  
  const [slotDateVal, setSlotDateVal] = useState("");
  const [slotTimeVal, setSlotTimeVal] = useState(BASE_SLOTS[0]);
  const [slotReason, setSlotReason] = useState("");
  
  const [lunchDateVal, setLunchDateVal] = useState("");
  const [lunchStart, setLunchStart] = useState("12:00 PM");
  const [lunchEnd, setLunchEnd] = useState("12:30 PM");

  // Admin Preview states
  const [previewDate, setPreviewDate] = useState("");
  const [previewSlot, setPreviewSlot] = useState("");
  const [previewAvailableDates, setPreviewAvailableDates] = useState<any[]>([]);
  const [previewUnavailableSlots, setPreviewUnavailableSlots] = useState<string[]>([]);
  const [previewLunchSlots, setPreviewLunchSlots] = useState<string[]>([]);
  const [previewBookedSlots, setPreviewBookedSlots] = useState<string[]>([]);
  const [previewLoadingSlots, setPreviewLoadingSlots] = useState(false);

  // Helper auth fetch wrapper
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!supabase) return fetch(url, options);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const headers = {
      ...options.headers,
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
    return fetch(url, { ...options, headers });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resHolidays, resBlockedDates, resBlockedSlots, resLunch] = await Promise.all([
        authFetch("/api/admin/availability/holidays"),
        authFetch("/api/admin/availability/blocked-dates"),
        authFetch("/api/admin/availability/blocked-slots"),
        authFetch("/api/admin/availability/lunch-overrides")
      ]);

      const holidaysData = await resHolidays.json();
      const blockedDatesData = await resBlockedDates.json();
      const blockedSlotsData = await resBlockedSlots.json();
      const lunchData = await resLunch.json();

      if (holidaysData.success) setHolidays(holidaysData.items || []);
      if (blockedDatesData.success) setBlockedDates(blockedDatesData.items || []);
      if (blockedSlotsData.success) setBlockedSlots(blockedSlotsData.items || []);
      if (lunchData.success) setLunchOverrides(lunchData.items || []);
    } catch (err) {
      console.error("Load availability data error:", err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate Admin Preview dates and slots
  const generatePreviewCalendar = useCallback(() => {
    const dates = [];
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: "short" };
    
    const today = new Date();
    let checkDate = new Date();

    // Map active holidays and blocked dates
    const inactiveOrBlockedDates = [
      ...holidays.filter(h => h.is_active).map(h => h.exception_date),
      ...blockedDates.filter(b => b.is_active).map(b => b.exception_date)
    ];

    let added = 0;
    for (let i = 0; i < 45 && added < 10; i++) {
      if (i > 0) {
        checkDate.setDate(checkDate.getDate() + 1);
      }
      
      const dateStr = checkDate.toISOString().split("T")[0];
      
      if (checkDate.getDay() !== 0) { // Exclude Sundays
        const isHoliday = inactiveOrBlockedDates.includes(dateStr);
        dates.push({
          dateStr,
          label: checkDate.toLocaleDateString("en-US", options),
          dayName: checkDate.toLocaleDateString("en-US", dayOptions),
          isHoliday
        });
        added++;
      }
    }
    setPreviewAvailableDates(dates);

    // Auto-select first non-disabled preview date if none selected
    const defaultDate = dates.find(d => !d.isHoliday);
    if (defaultDate && !previewDate) {
      setPreviewDate(defaultDate.dateStr);
    }
  }, [holidays, blockedDates, previewDate]);

  useEffect(() => {
    generatePreviewCalendar();
  }, [generatePreviewCalendar]);

  // Compute unavailable slots for selected previewDate
  useEffect(() => {
    if (!previewDate) return;
    
    setPreviewLoadingSlots(true);
    let disabled = getDefaultLunchSlots(); 

    // Check for lunch break override
    const activeOverride = lunchOverrides.find(o => o.override_date === previewDate && o.is_active);
    if (activeOverride) {
      disabled = [];
      const startMin = timeToMinutes24(activeOverride.start_time);
      const endMin = timeToMinutes24(activeOverride.end_time);

      BASE_SLOTS.forEach(slot => {
        const slotMin = timeToMinutes(slot);
        if (slotMin >= startMin && slotMin < endMin) {
          disabled.push(slot);
        }
      });
    }

    setPreviewLunchSlots([...disabled]);

    // Check for blocked slots
    const activeBlocked = blockedSlots.filter(s => s.blocked_date === previewDate && s.is_active);
    activeBlocked.forEach(s => {
      const slot12h = convert24to12(s.slot_time);
      if (!disabled.includes(slot12h)) {
        disabled.push(slot12h);
      }
    });

    // Check if previewDate is today, disable past slots
    const todayStr = new Date().toISOString().split("T")[0];
    if (previewDate === todayStr) {
      const now = new Date();
      BASE_SLOTS.forEach(slot => {
        const [timeStr, modifier] = slot.split(" ");
        let [hoursStr, minutesStr] = timeStr.split(":");
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        
        if (hours === 12) hours = 0;
        if (modifier === "PM") hours += 12;

        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        if (now > slotTime) {
          if (!disabled.includes(slot)) {
            disabled.push(slot);
          }
        }
      });
    }

    setPreviewUnavailableSlots(disabled);
    setPreviewLoadingSlots(false);
  }, [previewDate, blockedSlots, lunchOverrides]);

  // Reset form states helper
  const resetForms = () => {
    setEditingId(null);
    setHolidayDate("");
    setHolidayReason("");
    setBlockedDateVal("");
    setBlockedDateReason("");
    setSlotDateVal("");
    setSlotTimeVal(BASE_SLOTS[0]);
    setSlotReason("");
    setLunchDateVal("");
    setLunchStart("12:00 PM");
    setLunchEnd("12:30 PM");
  };

  // CRUD handlers
  const handleSaveHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate) return;

    setSaving(true);
    try {
      const isNew = !editingId;
      const method = isNew ? "POST" : "PUT";
      const url = isNew 
        ? "/api/admin/availability/holidays" 
        : `/api/admin/availability/holidays?id=${editingId}`;

      const payload = isNew 
        ? { exception_date: holidayDate, reason: holidayReason, is_active: true }
        : { reason: holidayReason };

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        resetForms();
        await loadData();
      } else {
        alert(data.error || "Failed to save holiday");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving holiday exception");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockedDateVal) return;

    setSaving(true);
    try {
      const isNew = !editingId;
      const method = isNew ? "POST" : "PUT";
      const url = isNew 
        ? "/api/admin/availability/blocked-dates" 
        : `/api/admin/availability/blocked-dates?id=${editingId}`;

      const payload = isNew 
        ? { exception_date: blockedDateVal, reason: blockedDateReason, is_active: true }
        : { reason: blockedDateReason };

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        resetForms();
        await loadData();
      } else {
        alert(data.error || "Failed to save blocked date");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blocked date rule");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDateVal || !slotTimeVal) return;

    setSaving(true);
    try {
      const isNew = !editingId;
      const method = isNew ? "POST" : "PUT";
      const url = isNew 
        ? "/api/admin/availability/blocked-slots" 
        : `/api/admin/availability/blocked-slots?id=${editingId}`;

      const payload = isNew 
        ? { blocked_date: slotDateVal, slot_time: slotTimeVal, reason: slotReason, is_active: true }
        : { reason: slotReason };

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        resetForms();
        await loadData();
      } else {
        alert(data.error || "Failed to block slot");
      }
    } catch (err) {
      console.error(err);
      alert("Error blocking appointment slot");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLunchOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lunchDateVal || !lunchStart || !lunchEnd) return;

    const startM = timeToMinutes(lunchStart);
    const endM = timeToMinutes(lunchEnd);
    if (startM >= endM) {
      alert("Lunch break end time must be after the start time");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingId;
      const method = isNew ? "POST" : "PUT";
      const url = isNew 
        ? "/api/admin/availability/lunch-overrides" 
        : `/api/admin/availability/lunch-overrides?id=${editingId}`;

      const payload = isNew 
        ? { override_date: lunchDateVal, start_time: lunchStart, end_time: lunchEnd, is_active: true }
        : { start_time: lunchStart, end_time: lunchEnd };

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        resetForms();
        await loadData();
      } else {
        alert(data.error || "Failed to save lunch break override");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving lunch break override");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (table: "availability_exceptions" | "blocked_slots" | "lunch_overrides", item: any) => {
    try {
      let endpoint = "";
      if (table === "availability_exceptions") {
        endpoint = item.type === "holiday" ? "holidays" : "blocked-dates";
      } else if (table === "blocked_slots") {
        endpoint = "blocked-slots";
      } else {
        endpoint = "lunch-overrides";
      }

      const res = await authFetch(`/api/admin/availability/${endpoint}?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active })
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      }
    } catch (err) {
      console.error("Toggle rule status failed:", err);
    }
  };

  const handleDeleteRule = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure you want to permanently delete this rule?")) return;

    try {
      const res = await authFetch(`/api/admin/availability/${endpoint}?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        alert(data.error || "Failed to delete rule");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#001B4B]">Availability Management</h1>
          <p className="text-sm text-slate-500 mt-1">Configure holidays, leave days, block specific appointment slots, or override lunch hours.</p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* Grid Layout: Controls Panel + Side Dashboard Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Tabs and Management Forms (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Tabs header */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            {(["holidays", "blocked-dates", "blocked-slots", "lunch-overrides"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); resetForms(); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    isActive 
                      ? "bg-white text-[#02457A] shadow-sm font-extrabold" 
                      : "text-slate-50/70 hover:text-slate-800 text-slate-500"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              );
            })}
          </div>

          {/* Form and listing container */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* HOLIDAY MANAGEMENT TAB */}
            {activeTab === "holidays" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveHoliday} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Holiday Date</label>
                    <input 
                      type="date"
                      value={holidayDate}
                      disabled={!!editingId}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE] disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Independence Day"
                      value={holidayReason}
                      onChange={(e) => setHolidayReason(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 bg-[#02457A] hover:bg-[#02457A]/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                      <span>{editingId ? "Save Change" : "Add Holiday"}</span>
                    </button>
                  </div>
                </form>

                {/* Holiday Listing table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Holidays List</h4>
                  {holidays.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
                      No holidays added. Add one using the form above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {holidays.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-[#001B4B]">{new Date(item.exception_date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
                            {item.reason && <p className="text-[11px] text-slate-400 font-medium">{item.reason}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Toggle active button */}
                            <button
                              onClick={() => handleToggleActive("availability_exceptions", item)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title={item.is_active ? "Mark Inactive" : "Mark Active"}
                            >
                              {item.is_active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setHolidayDate(item.exception_date); setHolidayReason(item.reason || ""); }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRule("holidays", item.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BLOCKED DATES TAB */}
            {activeTab === "blocked-dates" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveBlockedDate} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date to Block</label>
                    <input 
                      type="date"
                      value={blockedDateVal}
                      disabled={!!editingId}
                      onChange={(e) => setBlockedDateVal(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE] disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Clinical Conference"
                      value={blockedDateReason}
                      onChange={(e) => setBlockedDateReason(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 bg-[#02457A] hover:bg-[#02457A]/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                      <span>{editingId ? "Save Change" : "Block Date"}</span>
                    </button>
                  </div>
                </form>

                {/* Blocked Dates list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blocked Dates List</h4>
                  {blockedDates.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
                      No blocked dates. Add one using the form above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blockedDates.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-[#001B4B]">{new Date(item.exception_date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
                            {item.reason && <p className="text-[11px] text-slate-400 font-medium">{item.reason}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleActive("availability_exceptions", item)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              {item.is_active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setBlockedDateVal(item.exception_date); setBlockedDateReason(item.reason || ""); }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRule("blocked-dates", item.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BLOCKED SLOTS TAB */}
            {activeTab === "blocked-slots" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveBlockedSlot} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target Date</label>
                    <input 
                      type="date"
                      value={slotDateVal}
                      disabled={!!editingId}
                      onChange={(e) => setSlotDateVal(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE] disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Slot Time</label>
                    <select
                      value={slotTimeVal}
                      disabled={!!editingId}
                      onChange={(e) => setSlotTimeVal(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    >
                      {BASE_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Surgery"
                      value={slotReason}
                      onChange={(e) => setSlotReason(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 bg-[#02457A] hover:bg-[#02457A]/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                      <span>{editingId ? "Save Change" : "Block Slot"}</span>
                    </button>
                  </div>
                </form>

                {/* Blocked Slots list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blocked Slots List</h4>
                  {blockedSlots.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
                      No blocked slots. Block one using the form above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blockedSlots.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-[#001B4B]">{new Date(item.blocked_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">{convert24to12(item.slot_time)}</span>
                              {item.reason && <span className="text-[10px] text-slate-400 font-medium">({item.reason})</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleActive("blocked_slots", item)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              {item.is_active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setSlotDateVal(item.blocked_date); setSlotTimeVal(convert24to12(item.slot_time)); setSlotReason(item.reason || ""); }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRule("blocked-slots", item.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LUNCH OVERRIDES TAB */}
            {activeTab === "lunch-overrides" && (
              <div className="space-y-6">
                <form onSubmit={handleSaveLunchOverride} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Override Date</label>
                    <input 
                      type="date"
                      value={lunchDateVal}
                      disabled={!!editingId}
                      onChange={(e) => setLunchDateVal(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE] disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Start Time</label>
                    <select
                      value={lunchStart}
                      onChange={(e) => setLunchStart(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    >
                      {BASE_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">End Time</label>
                    <select
                      value={lunchEnd}
                      onChange={(e) => setLunchEnd(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#018ABE]"
                    >
                      {BASE_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 bg-[#02457A] hover:bg-[#02457A]/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                      <span>{editingId ? "Save Change" : "Save Override"}</span>
                    </button>
                  </div>
                </form>

                {/* Lunch Overrides list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lunch Break Overrides</h4>
                  {lunchOverrides.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
                      No overrides added. Override lunch slots using the form above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lunchOverrides.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-[#001B4B]">{new Date(item.override_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-800">{convert24to12(item.start_time)} – {convert24to12(item.end_time)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleActive("lunch_overrides", item)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              {item.is_active ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setLunchDateVal(item.override_date); setLunchStart(convert24to12(item.start_time)); setLunchEnd(convert24to12(item.end_time)); }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRule("lunch-overrides", item.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Section: Active Rules Summary & Live Booking Calendar Preview (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Card 1: Active Rules Summary Panel */}
          <div className="bg-[#001B4B] text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-heading font-bold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <CalendarCheck size={16} className="text-[#018ABE]" />
              <span>Availability Summary</span>
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Working Days</span>
                <span>Mon – Sat</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Sunday</span>
                <span className="text-red-400">Closed</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Slot Duration</span>
                <span>10 Minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Default Lunch Break</span>
                <span className="text-amber-400">12:30 PM - 02:00 PM (disabled)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Active Holidays</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{holidays.filter(h => h.is_active).length} Rules</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span className="text-slate-400">Active Blocked Dates</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{blockedDates.filter(b => b.is_active).length} Rules</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Active Blocked Slots</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{blockedSlots.filter(s => s.is_active).length} Slots</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Booking Calendar Preview */}
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-brand-dark flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock size={16} className="text-[#018ABE]" />
              <span>Public Calendar Preview</span>
            </h3>
            
            <p className="text-[11px] text-slate-400">
              Interactive rendering of how slots appear dynamically on the patient booking calendar.
            </p>

            <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
              <BookingCalendar
                compact={true}
                availableDates={previewAvailableDates}
                selectedDate={previewDate}
                setSelectedDate={setPreviewDate}
                loadingSlots={previewLoadingSlots}
                baseSlots={BASE_SLOTS}
                bookedSlots={previewBookedSlots}
                unavailableSlots={previewUnavailableSlots}
                selectedSlot={previewSlot}
                setSelectedSlot={setPreviewSlot}
                lunchSlots={previewLunchSlots}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
