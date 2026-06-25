"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Send,
  Loader2,
  Calendar
} from "lucide-react";

export default function EmailLogsPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Search & filter state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [emailTypeFilter, setEmailTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (statusFilter) params.append("status", statusFilter);
    if (emailTypeFilter) params.append("emailType", emailTypeFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    fetch(`/api/admin/email-logs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs || []);
        }
      })
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter, emailTypeFilter, startDate, endDate]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchLogs();
    }
  };

  const handleResend = (id: string) => {
    setResendingId(id);
    fetch("/api/admin/email-logs/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Email successfully resent!");
          fetchLogs();
        } else {
          alert(`Resend failed: ${data.error}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Network error occurred while resending");
      })
      .finally(() => {
        setResendingId(null);
      });
  };

  const failedLogs = logs.filter((log) => log.status === "Failed");

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark flex items-center gap-2">
            <Activity className="text-[#02457A]" />
            <span>Email Delivery Logs</span>
          </h1>
          <p className="text-sm text-text-body">Inspect transmission outputs and handle SMTP retries.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#018ABE]" : ""} />
          <span>RELOAD LOGS</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search email, name or appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A] transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A] bg-white cursor-pointer"
            >
              <option value="">Filter by Status (All)</option>
              <option value="Sent">Sent / Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Email Type filter */}
          <div>
            <select
              value={emailTypeFilter}
              onChange={(e) => setEmailTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A] bg-white cursor-pointer"
            >
              <option value="">Filter by Email Type (All)</option>
              <option value="Appointment Confirmation">Appointment Confirmation</option>
              <option value="Doctor Notification">Doctor Notification</option>
              <option value="Reminder Email">Reminder Email</option>
            </select>
          </div>
        </div>

        {/* Date Filter Range row */}
        <div className="flex flex-wrap items-center gap-4 pt-1.5 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Calendar size={14} />
            <span>Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A]"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-brand-dark focus:outline-none focus:border-[#02457A]"
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setEmailTypeFilter("");
              setStartDate("");
              setEndDate("");
            }}
            className="text-xs font-bold text-[#018ABE] hover:underline cursor-pointer ml-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main split screen layout: Left Table, Right Failed Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Logs Table (Left side - span 2) */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-brand-dark">Transaction Log Registry</h3>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 rounded-full">
              {logs.length} Total Logs matching
            </span>
          </div>

          <div className="overflow-x-auto flex-grow">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="h-7 w-7 animate-spin text-[#02457A] mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Querying database...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <p className="text-sm font-bold text-slate-400">No logs found matching selection.</p>
                <p className="text-xs text-slate-400">Try loosening your keyword or dropdown criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase text-[9px] tracking-wider">
                    <th className="p-4 pl-6">Email Type</th>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Appointment ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-brand-dark">{log.email_type}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{log.recipient_name || "N/A"}</div>
                        <div className="text-[10px] text-slate-400">{log.recipient_email}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-500">
                        {log.appointment?.appointment_id_custom || log.appointment_id || "None"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          log.status === "Sent" || log.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : log.status === "Failed"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {log.status === "Sent" || log.status === "Delivered" ? (
                            <CheckCircle2 size={10} />
                          ) : log.status === "Failed" ? (
                            <XCircle size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="p-4 pr-6 font-medium text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Failed Inspector Section (Right side - span 1) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col h-fit">
          <div className="pb-4 border-b border-slate-100 mb-5">
            <h3 className="font-heading font-bold text-sm text-brand-dark flex items-center gap-2">
              <AlertTriangle className="text-rose-500 h-5 w-5" />
              <span>Failed Email Queue</span>
            </h3>
            <p className="text-xs text-text-body">Action center for transmission issues</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-10 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#02457A] mx-auto" />
              </div>
            ) : failedLogs.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-xs font-bold text-slate-500">Zero Delivery Failures!</p>
                <p className="text-[10px] text-slate-400">SMTP service is operating perfectly.</p>
              </div>
            ) : (
              failedLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-3 shadow-inner"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-rose-800">{log.email_type}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{log.recipient_email}</p>
                    </div>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white border border-rose-100/50 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Raw SMTP Error</p>
                    <p className="text-[11px] font-mono text-rose-700 leading-normal break-words whitespace-pre-wrap select-all max-h-16 overflow-y-auto">
                      {log.error_message || "Unknown SMTP response code"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleResend(log.id)}
                    disabled={resendingId === log.id}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendingId === log.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>RESENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Resend Email</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
