"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Calendar as CalendarIcon, Clock, CheckCircle,
  Phone, AlertCircle, Sparkles, Info, ChevronRight, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import BookingCalendar from "@/components/BookingCalendar";

// Steps definition
const STEPS = [
  { id: 1, name: "Patient Details", icon: User },
  { id: 2, name: "Date & Time", icon: CalendarIcon },
  { id: 3, name: "Verify Review", icon: Info },
  { id: 4, name: "Success", icon: CheckCircle }
];

// Clinic static metadata
const CLINIC_INFO = {
  name: "Narayan Homoeopathic Chikitsalaya",
  address: "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667",
  phone: "+91-1332 270021",
  email: "homoeopathy4u@gmail.com"
};

import { BASE_SLOTS, getDefaultLunchSlots } from "@/lib/bookingConfig";

// Configurable future booking range limit (in days)
const FUTURE_DAYS_LIMIT = 10;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  // Patient Info Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    reason: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date/Time Selection State
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [currentLunchSlots, setCurrentLunchSlots] = useState<string[]>([]);

  // Local session backup to track bookings if Supabase is offline/unconfigured
  const [localBookings, setLocalBookings] = useState<Record<string, string[]>>({});

  // Helpers for time formatting
  const convert24to12 = (time24h: string): string => {
    const [hoursStr, minutesStr] = time24h.split(":");
    let hours = parseInt(hoursStr, 10);
    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${minutesStr} ${modifier}`;
  };

  const timeToMinutes = (timeStr: string): number => {
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
  };

  const timeToMinutes24 = (time24h: string): number => {
    const [hoursStr, minutesStr] = time24h.split(":");
    return parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
  };

  // Calendar dates representation
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; label: string; dayName: string; isHoliday?: boolean }[]>([]);

  // 1. Generate available dates (including today, excluding past dates & Sundays) and check holidays from Supabase
  useEffect(() => {
    async function generateCalendar() {
      const dates = [];
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      const dayOptions: Intl.DateTimeFormatOptions = { weekday: "short" };

      const today = new Date();
      let checkDate = new Date();

      // Fetch active holiday & blocked date exceptions from Supabase for this range
      let supabaseExceptions: string[] = [];
      if (supabase) {
        try {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + FUTURE_DAYS_LIMIT);

          const { data } = await supabase
            .from("availability_exceptions")
            .select("exception_date")
            .eq("is_active", true)
            .gte("exception_date", today.toISOString().split("T")[0])
            .lte("exception_date", endDate.toISOString().split("T")[0]);

          if (data) {
            supabaseExceptions = data.map((item: any) => item.exception_date);
          }
        } catch (err) {
          console.warn("Could not fetch availability exceptions, relying on baseline days:", err);
        }
      }

      let added = 0;
      // Loop up to 45 times to find 10 valid clinic operating days
      for (let i = 0; i < 45 && added < FUTURE_DAYS_LIMIT; i++) {
        if (i > 0) {
          checkDate.setDate(checkDate.getDate() + 1);
        }

        const dateStr = checkDate.toISOString().split("T")[0];

        // Exclude Sundays
        if (checkDate.getDay() !== 0) {
          const isHoliday = supabaseExceptions.includes(dateStr);
          dates.push({
            dateStr,
            label: checkDate.toLocaleDateString("en-US", options),
            dayName: checkDate.toLocaleDateString("en-US", dayOptions),
            isHoliday
          });
          added++;
        }
      }

      setAvailableDates(dates);

      // Auto-select first non-holiday date (usually today)
      const defaultDate = dates.find(d => !d.isHoliday);
      if (defaultDate) {
        setSelectedDate(defaultDate.dateStr);
      }
    }

    generateCalendar();
  }, []);

  // 2. Fetch booked slots and compute live time constraints
  useEffect(() => {
    if (!selectedDate) return;

    async function fetchBookings() {
      setLoadingSlots(true);
      if (currentStep < 3) {
        setSelectedSlot(""); // Reset slot select
      }

      // A. Standard blocked slots: Lunch/break hours (12:30 PM to 02:00 PM) are disabled by default
      let disabled = getDefaultLunchSlots();

      // Check lunch override for this selectedDate
      if (supabase) {
        try {
          const { data: override } = await supabase
            .from("lunch_overrides")
            .select("start_time, end_time")
            .eq("override_date", selectedDate)
            .eq("is_active", true)
            .maybeSingle();

          if (override) {
            // Overwrite the default lunch slot with custom lunch slot(s)
            disabled = [];
            const startMin = timeToMinutes24(override.start_time);
            const endMin = timeToMinutes24(override.end_time);

            BASE_SLOTS.forEach(slot => {
              const slotMin = timeToMinutes(slot);
              if (slotMin >= startMin && slotMin < endMin) {
                disabled.push(slot);
              }
            });
          }
        } catch (err) {
          console.warn("Lunch overrides fetch error:", err);
        }
      }

      setCurrentLunchSlots([...disabled]);

      // Check individual blocked slots for this selectedDate
      if (supabase) {
        try {
          const { data: blockedSlots } = await supabase
            .from("blocked_slots")
            .select("slot_time")
            .eq("blocked_date", selectedDate)
            .eq("is_active", true);

          if (blockedSlots) {
            blockedSlots.forEach((row: any) => {
              const slot12h = convert24to12(row.slot_time);
              if (!disabled.includes(slot12h)) {
                disabled.push(slot12h);
              }
            });
          }
        } catch (err) {
          console.warn("Blocked slots fetch error:", err);
        }
      }

      // B. If selectedDate is TODAY, block past slots dynamically
      const todayStr = new Date().toISOString().split("T")[0];
      if (selectedDate === todayStr) {
        const now = new Date();
        BASE_SLOTS.forEach(slot => {
          // Convert slot label to hour & minute (e.g. "09:30 AM")
          const [timeStr, modifier] = slot.split(" ");
          let [hoursStr, minutesStr] = timeStr.split(":");
          let hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);

          if (hours === 12) {
            hours = 0;
          }
          if (modifier === "PM") {
            hours += 12;
          }

          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);

          if (now > slotTime) {
            if (!disabled.includes(slot)) {
              disabled.push(slot); // Mark as unavailable/blocked
            }
          }
        });
      }

      setUnavailableSlots(disabled);

      // C. Query Supabase for active patient bookings on this date
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("appointments")
            .select("appointment_time")
            .eq("appointment_date", selectedDate)
            .neq("status", "cancelled");

          if (error) throw error;

          if (data) {
            const dbBooked = data.map((item: any) => {
              const timeParts = item.appointment_time.split(":");
              let hours = parseInt(timeParts[0]);
              const minutes = timeParts[1];
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12;
              hours = hours ? hours : 12;
              const padHours = hours < 10 ? `0${hours}` : hours;
              return `${padHours}:${minutes} ${ampm}`;
            });
            setBookedSlots(dbBooked);
          } else {
            setBookedSlots([]);
          }
        } catch (err) {
          console.warn("Supabase fetch failed, falling back to session bookings:", err);
          setBookedSlots(localBookings[selectedDate] || []);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        // Fallback to local session storage
        setTimeout(() => {
          setBookedSlots(localBookings[selectedDate] || []);
          setLoadingSlots(false);
        }, 300);
      }
    }

    fetchBookings();
  }, [selectedDate, localBookings, currentStep]);

  // Form Validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      tempErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.address.trim()) tempErrors.address = "Address is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateForm()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!selectedSlot) {
        setErrors({ slot: "Please choose an available appointment slot" });
      } else {
        setErrors({});
        setCurrentStep(3);
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `NHC-${year}-${randomSeq}`;

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          age: formData.age,
          gender: formData.gender,
          reason: formData.reason,
          date: selectedDate,
          time: selectedSlot
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to process booking");
      }

      setAppointmentId(result.appointmentId);
      setLocalBookings(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), selectedSlot]
      }));
      setCurrentStep(4);
    } catch (err: any) {
      console.error("Booking request failed:", err);
      setErrors({ submit: err.message || "Failed to process booking. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <BrandingSection />
      <Navbar />

      <main className="min-h-screen bg-gradient-to-tr from-slate-50 via-blue-50/20 to-slate-100/50 py-12 md:py-20 relative overflow-hidden flex flex-col justify-center">
        {/* Soft Decorative Gradients */}
        <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-brand-light/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 w-full">

          {/* HEADER BRANDING */}
          <div className="text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#018ABE] uppercase tracking-wider bg-brand-light/40 px-3.5 py-1.5 rounded-full">
              <Sparkles size={13} className="text-brand-secondary animate-pulse" />
              Direct Booking Desk
            </span>
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-brand-dark tracking-tight">
              Schedule Your Consultation
            </h1>
            <p className="text-text-body/75 text-xs md:text-sm max-w-lg mx-auto">
              Confirm your appointment slot directly in our secure medical booking console.
            </p>
          </div>

          {/* STEP PROGRESS INDICATOR */}
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-brand-secondary -translate-y-1/2 transition-all duration-500 ease-out -z-10"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step) => {
                const IconComponent = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-semibold text-xs md:text-sm ${isActive
                          ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105"
                          : "bg-white border-slate-200 text-slate-400"
                        } ${isCurrent ? "ring-4 ring-brand-light/50" : ""}`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold tracking-tight hidden sm:block ${isActive ? "text-brand-dark" : "text-slate-400"}`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN GLASSMORPHIC PANEL CONTAINER */}
          <div className="relative">
            <AnimatePresence mode="wait">

              {/* STEP 1: PATIENT INFORMATION */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/85 backdrop-blur-md border border-white/50 shadow-2xl rounded-[2.5rem] p-6 md:p-10 space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">Patient Profile</h2>
                    <p className="text-xs text-text-body/60 mt-0.5">Please provide your contact information to setup the consultation profile.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/85">Full Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full text-sm bg-slate-50/50 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all ${errors.fullName ? "border-red-400" : "border-slate-200 focus:border-brand-secondary"}`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10} />{errors.fullName}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/85">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full text-sm bg-slate-50/50 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all ${errors.email ? "border-red-400" : "border-slate-200 focus:border-brand-secondary"}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10} />{errors.email}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/85">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full text-sm bg-slate-50/50 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all ${errors.phone ? "border-red-400" : "border-slate-200 focus:border-brand-secondary"}`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {errors.phone && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10} />{errors.phone}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/85">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full text-sm bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all focus:border-brand-secondary"
                          placeholder="28"
                          min="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/85">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full text-sm bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all focus:border-brand-secondary"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-brand-dark/85">Physical Address *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full text-sm bg-slate-50/50 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all ${errors.address ? "border-red-400" : "border-slate-200 focus:border-brand-secondary"}`}
                        placeholder="House No, Road/Street, City, State, PIN"
                      />
                      {errors.address && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10} />{errors.address}</span>}
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-brand-dark/85">Reason for Visit (Symptoms / History)</label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        rows={3}
                        className="w-full text-sm bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 transition-all focus:border-brand-secondary resize-none"
                        placeholder="Brief description of primary clinical symptoms..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={handleNextStep}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-[1.02] transform"
                    >
                      <span>Continue to Schedule</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CALENDAR + AVAILABLE SLOTS */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/85 backdrop-blur-md border border-white/50 shadow-2xl rounded-[2.5rem] p-6 md:p-10 space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">Select Date & Time</h2>
                    <p className="text-xs text-text-body/60 mt-0.5">Select your preferred date and an available 10-minute consultation slot.</p>
                  </div>

                  <BookingCalendar
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    loadingSlots={loadingSlots}
                    baseSlots={BASE_SLOTS}
                    bookedSlots={bookedSlots}
                    unavailableSlots={unavailableSlots}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    errors={errors}
                    lunchSlots={currentLunchSlots}
                  />

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <button
                      onClick={handleBackStep}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 hover:text-brand-dark transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-[1.02] transform"
                    >
                      <span>Review Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW DETAILS */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/85 backdrop-blur-md border border-white/50 shadow-2xl rounded-[2.5rem] p-6 md:p-10 space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">Review Consultation Details</h2>
                    <p className="text-xs text-text-body/60 mt-0.5">Please check everything before finalizing your clinic appointment confirmation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Patient Card Review */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2">
                        <User size={16} className="text-[#018ABE]" />
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Patient Information</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Name:</span> <span className="font-bold text-brand-dark">{formData.fullName}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Email:</span> <span className="font-bold text-brand-dark">{formData.email}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Phone:</span> <span className="font-bold text-brand-dark">{formData.phone}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Age / Gender:</span> <span className="font-bold text-brand-dark">{formData.age || "N/A"} / {formData.gender || "N/A"}</span></div>
                        <div className="flex flex-col gap-1 pt-1"><span className="text-brand-dark/60 font-semibold">Address:</span> <span className="font-semibold text-brand-dark/85 leading-relaxed">{formData.address}</span></div>
                      </div>
                    </div>

                    {/* Appointment Card Review */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2">
                        <CalendarIcon size={16} className="text-[#018ABE]" />
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Consultation Details</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Selected Date:</span> <span className="font-bold text-brand-dark">{selectedDate}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Time Slot:</span> <span className="font-bold text-brand-primary">{selectedSlot}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Clinic Center:</span> <span className="font-bold text-brand-dark">{CLINIC_INFO.name}</span></div>
                        <div className="flex justify-between"><span className="text-brand-dark/60 font-semibold">Contact Phone:</span> <span className="font-bold text-brand-dark">{CLINIC_INFO.phone}</span></div>
                        <div className="flex flex-col gap-1 pt-1"><span className="text-brand-dark/60 font-semibold">Clinic Address:</span> <span className="font-semibold text-brand-dark/85 leading-relaxed">{CLINIC_INFO.address}</span></div>
                      </div>
                    </div>

                  </div>

                  {/* Warning dynamic exclusion notice */}
                  <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3 text-xs text-[#02457A]">
                    <Clock size={16} className="shrink-0 text-[#018ABE] mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Note on Double-Booking Guard:</strong> This appointment slot is locked to you temporarily. Final database write triggers once you click "Confirm Booking".
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-600 font-medium">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <button
                      onClick={handleBackStep}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 hover:text-brand-dark transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={handleSubmitBooking}
                      disabled={submitting}
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-[1.02] transform disabled:opacity-70 disabled:cursor-wait"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                          <CheckCircle size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: BOOKING SUCCESS CELEBRATION */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-[3rem] p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto"
                >
                  {/* Glowing Success Badge */}
                  <div className="relative w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                    <CheckCircle className="text-emerald-500" size={40} />
                    <div className="absolute w-24 h-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 animate-ping pointer-events-none -z-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-heading font-extrabold text-2xl md:text-4xl text-brand-dark">Appointment Booked!</h2>
                    <p className="text-xs md:text-sm text-text-body/80 max-w-md mx-auto leading-relaxed">
                      Your consultation details have been registered. A confirmation email was sent to <strong>{formData.email}</strong>.
                    </p>
                  </div>

                  {/* Summary Block */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left max-w-md mx-auto space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-wider">Booking ID</span>
                      <span className="text-xs font-bold text-[#018ABE] tracking-wider">{appointmentId}</span>
                    </div>
                    <div className="space-y-2 text-xs font-semibold text-brand-dark/85">
                      <div className="flex justify-between"><span>Patient Name:</span> <span>{formData.fullName}</span></div>
                      <div className="flex justify-between"><span>Consultation Date:</span> <span>{selectedDate}</span></div>
                      <div className="flex justify-between"><span>Time Slot:</span> <span className="text-emerald-600">{selectedSlot}</span></div>
                      <div className="flex justify-between"><span>Clinic Center:</span> <span>{CLINIC_INFO.name}</span></div>
                    </div>
                  </div>

                  {/* Redirection actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="bg-slate-100 hover:bg-slate-200 text-brand-dark text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={14} className="text-[#018ABE]" />
                      <span>Call Support Desk</span>
                    </a>

                    <Link
                      href="/"
                      className="bg-[#02457A] hover:bg-[#001B4B] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-full transition-all duration-200 shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2"
                    >
                      <span>Return to Home</span>
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
