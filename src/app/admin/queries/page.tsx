"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, 
  Search, 
  Mail, 
  Phone, 
  MessageSquare,
  User, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface QueryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function ContactQueriesPage() {
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchQueries = async () => {
    if (!supabase) {
      setError("Database connection not established");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("contact_queries")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setQueries(data || []);
    } catch (err: any) {
      console.error("Error fetching queries:", err);
      setError(err.message || "Failed to load enquiries from Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const searchedQueries = queries.filter(q => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      q.name?.toLowerCase().includes(search) ||
      q.email?.toLowerCase().includes(search) ||
      q.phone?.includes(search) ||
      q.message?.toLowerCase().includes(search)
    );
  });

  // Pagination
  const totalItems = searchedQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQueries = searchedQueries.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark">Contact Queries</h1>
          <p className="text-xs text-text-body mt-1">Manage and view messages submitted through the website contact form.</p>
        </div>
        <button 
          onClick={fetchQueries}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 flex items-center gap-3 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#018ABE] transition-colors"
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#02457A]" />
            <span className="text-xs font-semibold text-slate-400">Loading queries...</span>
          </div>
        ) : paginatedQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <MessageSquare className="h-10 w-10 text-slate-300" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">No contact queries found</p>
              <p className="text-xs text-slate-400 max-w-xs">There are no inquiries matching your search filters at this time.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Sender Details</th>
                  <th className="py-4 px-6">Message Description</th>
                  <th className="py-4 px-6 text-right">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedQueries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 space-y-1.5 max-w-[240px] truncate">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-extrabold text-brand-dark uppercase">{item.name}</span>
                      </div>
                      <div className="flex flex-col gap-1 pl-5.5 text-[11px] text-slate-500 font-semibold">
                        <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#018ABE]">
                          <Mail size={12} />
                          <span>{item.email}</span>
                        </a>
                        <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#018ABE]">
                          <Phone size={12} />
                          <span>{item.phone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium leading-relaxed max-w-lg whitespace-pre-wrap">
                      {item.message}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-400">
                      {new Date(item.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && totalPages > 1 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Queries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-500 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-500 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
