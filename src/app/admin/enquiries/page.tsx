"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Trash2, 
  Check, 
  Clock, 
  User, 
  MessageSquare,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const fetchEnquiries = () => {
    setLoading(true);
    fetch("/api/admin/enquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEnquiries(data.enquiries || []);
        } else {
          setError(data.error || "Failed to load enquiries");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network error occurred.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const markRead = (id: string, isRead: boolean) => {
    fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: isRead }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEnquiries((prev) =>
            prev.map((enq) => (enq.id === id ? { ...enq, is_read: isRead } : enq))
          );
          if (selectedEnquiry && selectedEnquiry.id === id) {
            setSelectedEnquiry((prev: any) => ({ ...prev, is_read: isRead }));
          }
        }
      })
      .catch((err) => console.error("Error updating enquiry status:", err));
  };

  const deleteEnquiry = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this enquiry?")) {
      return;
    }

    fetch(`/api/admin/enquiries?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
          setSelectedEnquiry(null);
        } else {
          alert(`Failed to delete: ${data.error}`);
        }
      })
      .catch((err) => console.error("Error deleting enquiry:", err));
  };

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark flex items-center gap-2">
            <Mail className="text-[#02457A]" />
            <span>Contact Form Enquiries</span>
          </h1>
          <p className="text-sm text-text-body">Review patient messages and medical consultation requests.</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-4 py-1.5 bg-rose-50 border border-rose-100 text-xs font-bold text-rose-700 rounded-full animate-pulse shrink-0">
            {unreadCount} Unread Message{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Listing Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#02457A] mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Checking client inbox...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-sm font-bold text-slate-400">Inbox is empty.</p>
            <p className="text-xs text-slate-400">All submissions have been reviewed or archived.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase text-[9px] tracking-wider">
                <th className="p-4 pl-6">Status</th>
                <th className="p-4">Sender Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">Date Submitted</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {enquiries.map((enq) => (
                <tr key={enq.id} className={`hover:bg-slate-50/50 transition-colors ${!enq.is_read ? "bg-[#02457A]/5 font-semibold" : ""}`}>
                  <td className="p-4 pl-6">
                    <span className={`h-2.5 w-2.5 rounded-full inline-block ${enq.is_read ? "bg-slate-200" : "bg-[#018ABE]"}`} />
                  </td>
                  <td className="p-4 text-slate-800">{enq.name}</td>
                  <td className="p-4 text-slate-600">{enq.phone_number}</td>
                  <td className="p-4 text-slate-500">{enq.email || "N/A"}</td>
                  <td className="p-4 text-slate-400 font-medium">{new Date(enq.created_at).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedEnquiry(enq)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      READ MESSAGE
                    </button>
                    <button
                      onClick={() => deleteEnquiry(enq.id)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                      title="Delete Entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enquiry Detail Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedEnquiry(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="h-16 border-b border-slate-150 flex items-center justify-between px-6 bg-[#001B4B] text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#018ABE] tracking-widest">PATIENT CONTACT INBOX</span>
                <h3 className="font-heading font-bold text-sm">Message details</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Profile */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#02457A]/10 text-[#02457A] flex items-center justify-center font-bold text-lg">
                    <User size={22} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand-dark text-base">{selectedEnquiry.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Clock size={11} /> {new Date(selectedEnquiry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs border-t border-slate-100 pt-2 space-y-2">
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[9px]">Phone</span>
                    <span className="font-semibold text-slate-700">{selectedEnquiry.phone_number}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[9px]">Email</span>
                    <span className="font-semibold text-slate-700">{selectedEnquiry.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Message content */}
              <div className="space-y-3">
                <h5 className="font-heading font-bold text-xs text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#018ABE]" />
                  <span>Submission Message / Details</span>
                </h5>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap select-all font-medium">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {!selectedEnquiry.is_read ? (
                <button
                  onClick={() => markRead(selectedEnquiry.id, true)}
                  className="flex-grow flex items-center justify-center gap-1.5 bg-[#02457A] hover:bg-[#001B4B] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Check size={14} />
                  <span>MARK AS READ</span>
                </button>
              ) : (
                <button
                  onClick={() => markRead(selectedEnquiry.id, false)}
                  className="flex-grow flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>MARK AS UNREAD</span>
                </button>
              )}
              <button
                onClick={() => deleteEnquiry(selectedEnquiry.id)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>DELETE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
