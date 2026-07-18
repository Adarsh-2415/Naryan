"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Calendar, 
  Users, 
  Image, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Inbox
} from "lucide-react";

import { getUserRole } from "@/lib/roles";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"admin" | "receptionist">("admin");

  const fetchStats = async () => {
    setLoading(true);
    try {
      let headers: Record<string, string> = {};
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        if (session?.user) {
          setRole(getUserRole(session.user));
        }
      }
      const res = await fetch("/api/admin/stats", { headers });
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      } else {
        setError(resData.error || "Failed to load dashboard statistics");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#02457A] mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  const stats = data?.stats;

  const summaryCards = [
    { 
      title: "Today's Appointments", 
      value: stats?.todayAppointments || 0, 
      icon: Calendar, 
      link: "/admin/appointments", 
      color: "bg-emerald-50 text-emerald-600 border-emerald-100", 
      trend: "Today" 
    },
    { 
      title: "Upcoming Bookings", 
      value: stats?.upcomingAppointments || 0, 
      icon: Clock, 
      link: "/admin/appointments", 
      color: "bg-blue-50 text-blue-600 border-blue-100", 
      trend: "Future" 
    },
    { 
      title: "Total Appointments", 
      value: stats?.totalAppointments || 0, 
      icon: Inbox, 
      link: "/admin/appointments", 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100", 
      trend: "All-time" 
    },
    { 
      title: "This Month Appointments", 
      value: stats?.monthAppointments || 0, 
      icon: Calendar, 
      link: "/admin/appointments", 
      color: "bg-teal-50 text-teal-600 border-teal-100", 
      trend: "This Month" 
    },
    { 
      title: "Contact Queries", 
      value: stats?.contactQueries || 0, 
      icon: MessageSquare, 
      link: "/admin/queries", 
      color: "bg-purple-50 text-purple-600 border-purple-100", 
      trend: "Messages",
      adminOnly: true
    },
    { 
      title: "Published Gallery", 
      value: stats?.publishedGalleryItems || 0, 
      icon: Image, 
      link: "/admin/pages", 
      color: "bg-amber-50 text-amber-600 border-amber-100", 
      trend: "Live Images",
      adminOnly: true
    }
  ].filter(card => !card.adminOnly || role === "admin");

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark">Clinical Dashboard</h1>
          <p className="text-sm text-text-body">Welcome back. Here is your practice status for today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">{new Date().toDateString()}</span>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.link}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span>{card.trend}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold font-heading text-brand-dark">{card.value}</span>
                  <span className="text-[10px] font-bold text-[#018ABE] group-hover:underline flex items-center gap-0.5">
                    Manage <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
