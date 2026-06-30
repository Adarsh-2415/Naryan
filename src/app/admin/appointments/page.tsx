"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, 
  Search, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  AlertTriangle, 
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Inbox
} from "lucide-react";

interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  age: number | null;
  gender: string | null;
  reason: string | null;
  appointment_date: string;
  appointment_time: string;
  email_status: string | null;
  email_sent_at: string | null;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "upcoming" | "past">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer selected patient
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAppointments = async () => {
    if (!supabase) {
      setError("Database connection not established");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (dbError) throw dbError;
      setAppointments(data || []);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments from Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);


  // 1. Client-Side Search
  const searchedAppointments = appointments.filter(app => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      app.full_name?.toLowerCase().includes(search) ||
      app.email?.toLowerCase().includes(search) ||
      app.phone?.includes(search)
    );
  });

  // 2. Client-Side Filter
  const filteredAppointments = searchedAppointments.filter(app => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (activeFilter === "today") {
      return app.appointment_date === todayStr;
    }
    if (activeFilter === "upcoming") {
      return app.appointment_date > todayStr;
    }
    if (activeFilter === "past") {
      return app.appointment_date < todayStr;
    }
    return true;
  });

  // Reset page when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // 3. Client-Side Pagination
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const getEmailStatusBadge = (status: string | null) => {
    const s = (status || "pending").toLowerCase();
    if (s === "sent") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>✅</span> Sent
        </span>
      );
    }
    if (s === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span>❌</span> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span>⏳</span> Pending
      </span>
    );
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative min-h-[80vh]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#001B4B]">Appointments</h1>
          <p className="text-sm text-slate-500">Manage patient bookings, monitor status, and inspect patient details.</p>
        </div>
        <button 
          onClick={fetchAppointments}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 cursor-pointer shadow-sm transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Database Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div className="space-y-1">
            <span className="font-semibold block">Failed to communicate with database</span>
            <span className="text-xs text-rose-700">{error}</span>
          </div>
        </div>
      )}

      {/* Controls: Search & Filters */}
      {!error && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#02457A] bg-slate-50/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {(["all", "today", "upcoming", "past"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                  activeFilter === filter
                    ? "bg-[#02457A] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Section */}
      {!error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Appointment Date</th>
                  <th className="px-6 py-4">Appointment Time</th>
                  <th className="px-6 py-4">Email Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {loading ? (
                  // Skeleton Loaders
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-28"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-36"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-150 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-150 rounded w-20"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-150 rounded w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition duration-150 text-sm">
                      <td className="px-6 py-4 font-bold text-slate-800">{app.full_name}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{app.email}</td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{app.phone}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{app.address}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {new Date(app.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{app.appointment_time}</td>
                      <td className="px-6 py-4">{getEmailStatusBadge(app.email_status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppointment(app);
                            setDrawerOpen(true);
                          }}
                          className="px-4.5 py-1.5 border border-slate-200 hover:bg-[#02457A] hover:text-white hover:border-[#02457A] text-slate-600 font-bold rounded-lg text-xs transition duration-250 cursor-pointer shadow-sm"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Clean Empty State
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Inbox className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No appointments found</p>
                        <p className="text-xs text-slate-400">There are no records matching your current criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && filteredAppointments.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(startIndex + itemsPerPage, filteredAppointments.length)}
                </span>{" "}
                of <span className="font-bold text-slate-700">{filteredAppointments.length}</span> entries
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 px-2.5">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Side Patient Profile Drawer */}
      {drawerOpen && selectedAppointment && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Slide-over Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-350">
            {/* Drawer Header */}
            <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-base font-bold font-heading text-[#001B4B]">Patient Profile</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">CMS Detail Inspection</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg cursor-pointer transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Patient Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="h-4 w-4 text-[#02457A]" />
                  <h4 className="text-xs font-extrabold uppercase text-[#02457A] tracking-wider">Patient Information</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                    <span className="text-sm font-bold text-slate-800 block">{selectedAppointment.full_name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Gender</span>
                    <span className="text-sm font-semibold text-slate-800 block">{selectedAppointment.gender || "Not specified"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Age</span>
                    <span className="text-sm font-semibold text-slate-800 block">{selectedAppointment.age !== null ? `${selectedAppointment.age} years` : "Not specified"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                    <span className="text-sm font-semibold text-slate-800 block">{selectedAppointment.phone}</span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                    <span className="text-sm font-semibold text-[#018ABE] block">{selectedAppointment.email}</span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Residential Address</span>
                    <span className="text-sm text-slate-700 font-medium block leading-relaxed">{selectedAppointment.address}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Calendar className="h-4 w-4 text-[#02457A]" />
                  <h4 className="text-xs font-extrabold uppercase text-[#02457A] tracking-wider">Appointment Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Appointment Date</span>
                    <span className="text-sm font-bold text-slate-800 block">
                      {new Date(selectedAppointment.appointment_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Appointment Time</span>
                    <span className="text-sm font-bold text-emerald-600 block">{selectedAppointment.appointment_time}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Status</span>
                    <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-150 inline-block">
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Registered</span>
                    <span className="text-xs font-medium text-slate-700 block">
                      {formatDateTime(selectedAppointment.created_at)}
                    </span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Reason for Visit</span>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-150/60 leading-relaxed font-medium">
                      {selectedAppointment.reason || "No symptoms or reason provided by the patient."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Notification Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Mail className="h-4 w-4 text-[#02457A]" />
                  <h4 className="text-xs font-extrabold uppercase text-[#02457A] tracking-wider">Email Notification Status</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Outbound Delivery</span>
                    <div className="block pt-0.5">{getEmailStatusBadge(selectedAppointment.email_status)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sent Timestamp</span>
                    <span className="text-xs font-semibold text-slate-700 block">
                      {selectedAppointment.email_sent_at ? formatDateTime(selectedAppointment.email_sent_at) : "Never / Failed"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
