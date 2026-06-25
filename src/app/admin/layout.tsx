"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Home, 
  Calendar, 
  Mail, 
  FileText, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Loader2,
  Settings,
  MailCheck
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      } else if (session && isLoginPage) {
        router.push("/admin");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001B4B] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#018ABE] mx-auto" />
          <p className="text-sm font-medium tracking-wide">Securing admin session...</p>
        </div>
      </div>
    );
  }

  // If it's the login page, just render the child login component directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not logged in and not on login page, prevent flash showing before redirect completes
  if (!session) {
    return null;
  }

  const menuItems = [
    { name: "Overview", href: "/admin", icon: Home },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Contact Enquiries", href: "/admin/enquiries", icon: Mail },
    { name: "Email Delivery Logs", href: "/admin/email-logs", icon: Activity },
    { name: "Content Workflows", href: "/admin/content", icon: FileText },
    { name: "Email Templates", href: "/admin/email-templates", icon: MailCheck },
    { name: "Global Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#001B4B] text-white flex-col border-r border-slate-800 shrink-0">
        {/* Brand header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-[#001438]/50">
          <div className="space-y-1">
            <span className="text-sm font-bold font-heading text-white tracking-tight leading-tight block">Narayan Homoeopathic Chikitsalaya</span>
            <div className="text-[10px] uppercase font-bold text-[#018ABE] tracking-wider">CMS & CONTROL PANEL</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#02457A] text-white shadow-md shadow-[#02457A]/20"
                    : "text-slate-300 hover:bg-[#02457A]/30 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout footer */}
        <div className="p-4 border-t border-slate-800 bg-[#001438]/30 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-full bg-[#02457A] flex items-center justify-center font-bold text-white text-sm shrink-0">
              {session.user?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{session.user?.email || "Administrator"}</p>
              <p className="text-[10px] text-[#018ABE] font-bold">SYSTEM ADMIN</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-950/40 hover:text-red-300 rounded-xl text-slate-300 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Mobile & Action bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 md:justify-end">
          {/* Mobile Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* User indicator */}
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500">SYSTEM LIVE</span>
          </div>
        </header>

        {/* Main scrollable body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative flex flex-col w-full max-w-xs bg-[#001B4B] text-white">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-[#001438]/50">
              <div className="space-y-1">
                <span className="text-sm font-bold font-heading text-white tracking-tight leading-tight block">Narayan Homoeopathic Chikitsalaya</span>
                <div className="text-[10px] uppercase font-bold text-[#018ABE] tracking-wider">CMS CONTROL</div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#02457A] text-white shadow-md"
                        : "text-slate-300 hover:bg-[#02457A]/30 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-[#001438]/30 space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="h-9 w-9 rounded-full bg-[#02457A] flex items-center justify-center font-bold text-white text-sm">
                  {session.user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate">{session.user?.email}</p>
                  <p className="text-[10px] text-[#018ABE] font-bold">SYSTEM ADMIN</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-red-950/40 rounded-xl text-slate-300 text-xs font-bold border border-slate-800 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
