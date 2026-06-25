"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Search, 
  Download, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  HelpCircle,
  X
} from "lucide-react";

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter criteria
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (statusFilter) params.append("status", statusFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    fetch(`/api/admin/appointments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAppointments(data.appointments || []);
        } else {
          setError(data.error || "Failed to load appointments");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network error occurred.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, startDate, endDate]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchAppointments();
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setActionLoading(true);
    fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update local state
          setAppointments((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
          );
          if (selectedApp && selectedApp.id === id) {
            setSelectedApp((prev: any) => ({ ...prev, status: newStatus }));
          }
        } else {
          alert(`Failed to update status: ${data.error}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Network error updating status");
      })
      .finally(() => setActionLoading(false));
  };

  // CSV Report Exporter
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = [
      "Appointment ID",
      "Patient Name",
      "Email Address",
      "Phone Number",
      "Address",
      "Date",
      "Time Slot",
      "Status",
      "Symptoms/Reason"
    ];

    const rows = appointments.map((app) => [
      app.appointment_id_custom || "N/A",
      app.patient?.full_name || "N/A",
      app.patient?.email || "N/A",
      app.patient?.phone_number || "N/A",
      `"${(app.patient?.address || "").replace(/"/g, '""')}"`,
      app.appointment_date,
      app.appointment_time,
      app.status,
      `"${(app.reason_for_visit || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Appointment_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark flex items-center gap-2">
            <Calendar className="text-[#02457A]" />
            <span>Consultation Registry</span>
          </h1>
          <p className="text-sm text-text-body">Manage booking lists, approve slots, and download Excel logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>EXPORT REPORTS (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by patient details */}
          <div className="relative md:col-span-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search patient, phone or Reference code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A] transition-colors"
            />
          </div>

          {/* Status filter dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A] bg-white cursor-pointer"
            >
              <option value="">Status Filter (All)</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date range filters */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A]"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A]"
            />
          </div>
        </div>
      </div>

      {/* Error or Table panel */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#02457A] mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Querying registry database...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-sm font-bold text-slate-400">No appointments found.</p>
            <p className="text-xs text-slate-400 font-medium">Try matching other names or widening filters.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase text-[9px] tracking-wider">
                <th className="p-4 pl-6">Reference ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Date / Time Slot</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-brand-dark">{app.appointment_id_custom}</td>
                  <td className="p-4 font-semibold text-slate-800">{app.patient?.full_name || "N/A"}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-700">{app.appointment_date}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      <span>{app.appointment_time}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-500">{app.patient?.phone_number || "N/A"}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      app.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : app.status === "cancelled"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {app.status === "confirmed" ? (
                        <CheckCircle2 size={10} />
                      ) : app.status === "cancelled" ? (
                        <XCircle size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      <span className="capitalize">{app.status}</span>
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      VIEW PROFILE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Appointment Profile Side Drawer Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedApp(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="h-16 border-b border-slate-150 flex items-center justify-between px-6 bg-[#001B4B] text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#018ABE] tracking-widest">PATIENT RECORD FILE</span>
                <h3 className="font-heading font-bold text-sm">{selectedApp.appointment_id_custom}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#02457A]/10 text-[#02457A] flex items-center justify-center font-bold text-lg">
                    <User size={22} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand-dark text-base">{selectedApp.patient?.full_name}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      Patient Age: {selectedApp.patient?.age || "N/A"} • Gender: {selectedApp.patient?.gender || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs border-t border-slate-100 pt-2 space-y-2">
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider flex items-center gap-1"><Phone size={11} /> Phone</span>
                    <span className="font-semibold text-slate-700">{selectedApp.patient?.phone_number}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider flex items-center gap-1"><Mail size={11} /> Email</span>
                    <span className="font-semibold text-slate-700">{selectedApp.patient?.email}</span>
                  </div>
                  <div className="flex flex-col py-1.5 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider flex items-center gap-1"><MapPin size={11} /> Home Address</span>
                    <span className="font-medium text-slate-600 leading-relaxed bg-white border border-slate-100 p-2 rounded-lg">{selectedApp.patient?.address}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3">
                <h5 className="font-heading font-bold text-xs text-brand-dark uppercase tracking-wider">Consultation Details</h5>
                <div className="bg-white border border-slate-200 rounded-xl p-4 divide-y divide-slate-100 text-xs space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Requested Date</span>
                    <span className="font-bold text-slate-700">{selectedApp.appointment_date}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Requested Slot</span>
                    <span className="font-bold text-[#02457A]">{selectedApp.appointment_time}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Current Registry Status</span>
                    <span className="font-bold uppercase text-[10px]">{selectedApp.status}</span>
                  </div>
                  <div className="flex flex-col py-2 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Patient Symptoms / Note</span>
                    <span className="font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                      {selectedApp.reason_for_visit || "No initial symptoms declared in online form."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer actions footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {selectedApp.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus(selectedApp.id, "confirmed")}
                  disabled={actionLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  CONFIRM APPOINTMENT
                </button>
              )}
              {selectedApp.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(selectedApp.id, "cancelled")}
                  disabled={actionLoading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  CANCEL APPOINTMENT
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
