"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  Layers, 
  Image, 
  MessageSquare, 
  Award, 
  BookOpen, 
  Video, 
  Activity,
  AlertTriangle, 
  MailCheck, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        } else {
          setError(res.error || "Failed to load dashboard statistics");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network error occurred. Please refresh.");
      })
      .finally(() => {
        setLoading(false);
      });
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
    { title: "Today's Appointments", value: stats?.todayAppointments, icon: Calendar, link: "/admin", color: "bg-emerald-50 text-emerald-600 border-emerald-100", trend: "+12%" },
    { title: "Upcoming Bookings", value: stats?.upcomingAppointments, icon: Users, link: "/admin", color: "bg-blue-50 text-blue-600 border-blue-100", trend: "+5%" },
    { title: "Total Treatments", value: stats?.totalTreatments, icon: Layers, link: "/admin", color: "bg-indigo-50 text-indigo-600 border-indigo-100", trend: "Steady" },
    { title: "Gallery Images", value: stats?.totalGalleryImages, icon: Image, link: "/admin", color: "bg-amber-50 text-amber-600 border-amber-100", trend: "Fixed" },
    { title: "Total Testimonials", value: stats?.totalTestimonials, icon: MessageSquare, link: "/admin", color: "bg-purple-50 text-purple-600 border-purple-100", trend: "+3 new" },
    { title: "Total Awards", value: stats?.totalAwards, icon: Award, link: "/admin", color: "bg-rose-50 text-rose-600 border-rose-100", trend: "Fixed" },
    { title: "Total Case Studies", value: stats?.totalCaseStudies, icon: BookOpen, link: "/admin", color: "bg-sky-50 text-sky-600 border-sky-100", trend: "+1 new" },
    { title: "Total Seminars", value: stats?.totalSeminars, icon: Video, link: "/admin", color: "bg-teal-50 text-teal-600 border-teal-100", trend: "Planned" },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-bold font-heading text-brand-dark">{card.value}</span>
                  <span className="text-xs font-bold text-[#018ABE] group-hover:underline flex items-center gap-1">
                    Manage <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid of widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Email Logs Activity Widget */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-brand-dark">Email Activity Logs</h3>
              <p className="text-xs text-text-body">Monitoring outbound delivery status</p>
            </div>
            <Link 
              href="/admin"
              className="text-xs font-bold text-[#018ABE] hover:underline flex items-center gap-1"
            >
              View Full Logs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Core metrics mini widgets */}
          <div className="grid grid-cols-3 gap-4 py-6 border-b border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
                <MailCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sent Today</span>
              <p className="text-2xl font-bold font-heading text-brand-dark mt-0.5">
                {stats?.emails?.sentToday || 0}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center relative overflow-hidden">
              {stats?.emails?.failedToday > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-ping m-2"></div>
              )}
              <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-2">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Failed Logs</span>
              <p className={`text-2xl font-bold font-heading mt-0.5 ${stats?.emails?.failedToday > 0 ? "text-rose-600 font-extrabold" : "text-brand-dark"}`}>
                {stats?.emails?.failedToday || 0}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending retry</span>
              <p className="text-2xl font-bold font-heading text-brand-dark mt-0.5">
                {stats?.emails?.pendingToday || 0}
              </p>
            </div>
          </div>

          {/* Quick instructions and alert link */}
          <div className="flex-1 flex flex-col justify-center mt-5">
            {stats?.emails?.failedToday > 0 ? (
              <div className="p-4 bg-rose-50/75 border border-rose-200/50 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-rose-800">SMTP Transmission Error Alert</p>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    Some booking notification emails failed to dispatch. Inspect raw server reports and trigger a manual retry to avoid patient service disruptions.
                  </p>
                  <Link 
                    href="/admin" 
                    className="inline-block text-xs font-bold text-rose-800 hover:underline pt-1.5"
                  >
                    Go to Failed Queue &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-xs font-bold text-slate-400">All transactional mail handlers operating correctly.</span>
              </div>
            )}
          </div>
        </div>

        {/* Activity feed widget */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-heading font-bold text-base text-brand-dark">Audit & Action Feeds</h3>
            <p className="text-xs text-text-body">Real-time status changes</p>
          </div>

          <div className="flex-grow space-y-4 overflow-y-auto max-h-[350px] pr-1">
            {data?.recentActivity?.length > 0 ? (
              data.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                    activity.type === "appointment" ? "bg-emerald-500" :
                    activity.type === "email_failure" ? "bg-rose-500" :
                    activity.type === "enquiry" ? "bg-blue-500" : "bg-slate-400"
                  }`}></div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-slate-700 truncate">{activity.message}</p>
                    <p className="text-[10px] text-slate-400">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <span className="text-xs font-bold text-slate-400">No activity registered today.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
