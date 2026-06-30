import React from "react";
import { Clock, AlertCircle } from "lucide-react";
import { SLOT_DURATION_MINUTES } from "@/lib/bookingConfig";

interface BookingCalendarProps {
  availableDates: { dateStr: string; label: string; dayName: string; isHoliday?: boolean }[];
  selectedDate: string;
  setSelectedDate: (dateStr: string) => void;
  loadingSlots: boolean;
  baseSlots: string[];
  bookedSlots: string[];
  unavailableSlots: string[];
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  errors?: Record<string, string>;
  setErrors?: (errs: Record<string, string>) => void;
  compact?: boolean;
  lunchSlots?: string[];
}

export default function BookingCalendar({
  availableDates,
  selectedDate,
  setSelectedDate,
  loadingSlots,
  baseSlots,
  bookedSlots,
  unavailableSlots,
  selectedSlot,
  setSelectedSlot,
  errors = {},
  setErrors = () => {},
  compact = false,
  lunchSlots = []
}: BookingCalendarProps) {
  return (
    <div className="space-y-6">
      {/* Informational Badge detailing Slot Duration */}
      <div className="inline-flex items-center gap-2 bg-[#D6E8EE]/40 border border-[#018ABE]/20 text-[#02457A] px-4 py-2.5 rounded-2xl text-xs font-bold w-full md:w-auto">
        <Clock size={15} className="text-[#018ABE]" />
        <span>⏱ Appointment Duration: {SLOT_DURATION_MINUTES} Minutes Per Slot</span>
      </div>

      <div className={compact ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-12 gap-8"}>
        
        {/* LEFT PANEL: INTERACTIVE CALENDAR MATRIX */}
        <div className={compact ? "space-y-3" : "lg:col-span-5 space-y-3"}>
          <span className="text-xs font-bold text-brand-dark/80 block uppercase tracking-wider">Available Dates</span>
          <div className={compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2.5"}>
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              
              if (item.isHoliday) {
                return (
                  <div
                    key={item.dateStr}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-100/50 text-slate-300 text-center cursor-not-allowed"
                    title="Clinic Closed (Holiday / Blocked)"
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-40 block">{item.dayName}</span>
                    <span className="text-sm font-extrabold font-heading mt-0.5 block">{item.label}</span>
                    <span className="text-[8px] font-bold text-rose-400 block mt-0.5">CLOSED</span>
                  </div>
                );
              }
              
              return (
                <button
                  type="button"
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected 
                      ? "bg-[#02457A] border-[#02457A] text-white shadow-md shadow-brand-primary/10 scale-105" 
                      : "bg-slate-50/50 border-slate-200 hover:border-brand-secondary text-brand-dark cursor-pointer"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">{item.dayName}</span>
                  <span className="text-sm font-extrabold font-heading mt-0.5 block">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: AVAILABLE SLOTS */}
        <div className={compact ? "space-y-3" : "lg:col-span-7 space-y-3"}>
          <span className="text-xs font-bold text-brand-dark/80 block uppercase tracking-wider">Available Slots</span>
          
          {loadingSlots ? (
            /* SKELETON LOADER STATE */
            <div className={compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 sm:grid-cols-3 gap-2.5"}>
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            /* LIVE SLOTS MATRIX */
            <div className={compact ? "grid grid-cols-3 gap-1.5" : "grid grid-cols-2 sm:grid-cols-3 gap-2.5"}>
              {(() => {
                const renderedSlots: React.ReactNode[] = [];
                let lunchCardRendered = false;

                baseSlots.forEach((slot) => {
                  const isLunch = lunchSlots.includes(slot);

                  if (isLunch) {
                    if (!lunchCardRendered) {
                      lunchCardRendered = true;
                      const startSlot = lunchSlots[0];
                      const lastLunchSlotIdx = baseSlots.indexOf(lunchSlots[lunchSlots.length - 1]);
                      const endSlot = lastLunchSlotIdx !== -1 && lastLunchSlotIdx + 1 < baseSlots.length 
                        ? baseSlots[lastLunchSlotIdx + 1] 
                        : "02:00 PM";

                      renderedSlots.push(
                        <div 
                          key="lunch-break-card"
                          className="col-span-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-1 shadow-sm select-none"
                        >
                          <div className="flex items-center gap-1.5 justify-center">
                            <span className="text-sm">🍽</span>
                            <span className="font-heading font-extrabold text-xs text-[#001B4B] uppercase tracking-wider">Lunch Break</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#018ABE] bg-[#D6E8EE]/40 px-3.5 py-0.5 rounded-full mt-1">
                            {startSlot} – {endSlot}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 mt-1">
                            Appointments are unavailable during this time.
                          </span>
                        </div>
                      );
                    }
                    return;
                  }

                  const isBooked = bookedSlots.includes(slot);
                  const isUnavailable = unavailableSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  
                  let btnClass = "bg-emerald-50/70 border-emerald-200/50 text-emerald-700 hover:bg-emerald-100/80 cursor-pointer";
                  
                  if (isBooked) {
                    btnClass = "bg-rose-50 border-rose-100 text-rose-400 line-through cursor-not-allowed";
                  } else if (isUnavailable) {
                    btnClass = "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed";
                  } else if (isSelected) {
                    btnClass = "bg-[#018ABE] border-[#018ABE] text-white shadow-md scale-[1.02] font-semibold";
                  }

                  renderedSlots.push(
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked || isUnavailable}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setErrors({});
                      }}
                      className={`py-3.5 px-2 rounded-2xl border text-center text-xs font-bold transition-all ${btnClass}`}
                    >
                      {slot}
                    </button>
                  );
                });

                return renderedSlots;
              })()}
            </div>
          )}

          {errors.slot && (
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 pt-2">
              <AlertCircle size={11} /> {errors.slot}
            </span>
          )}

          {/* LEGEND STRIP */}
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-brand-dark/65 font-bold pt-4 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Blocked / Past</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#018ABE] inline-block" /> Selected</span>
          </div>
        </div>

      </div>
    </div>
  );
}
