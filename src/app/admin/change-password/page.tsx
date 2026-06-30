"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Eye, EyeOff, Loader2, Save } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 1. Basic Client Side Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation password do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }

      // 2. Fetch current logged in user details
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || !user.email) {
        throw new Error("Could not retrieve active session user email. Please sign in again.");
      }

      // 3. Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (authError) {
        setMessage({ type: "error", text: "Invalid current password. Authentication failed." });
        setLoading(false);
        return;
      }

      // 4. Update password securely via Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Clear input fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Your password has been successfully updated!" });

    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to update password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      
      {/* Title block */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-heading font-bold text-lg text-brand-dark flex items-center gap-2">
          <ShieldCheck className="text-brand-secondary" size={20} />
          <span>Change Password</span>
        </h3>
        <p className="text-xs text-text-body/60 mt-1">Update your administrator portal access credentials securely.</p>
      </div>

      {/* Message callout */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleChangePassword} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#02457A] hover:bg-[#02457a]/95 disabled:bg-slate-300 text-white text-xs font-bold py-3.5 rounded-xl transition-colors cursor-pointer mt-6"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Update Admin Password</span>
        </button>
      </form>
    </div>
  );
}
