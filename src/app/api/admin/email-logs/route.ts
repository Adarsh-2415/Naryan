import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const emailType = searchParams.get("emailType") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    let query = supabase
      .from("email_logs")
      .select("*, appointment:appointments(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (emailType) {
      query = query.eq("email_type", emailType);
    }
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: logs, error } = await query;
    if (error) throw error;

    let filtered = logs || [];
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((log: any) => {
        const recipientEmail = log.recipient_email?.toLowerCase() || "";
        const recipientName = log.recipient_name?.toLowerCase() || "";
        const customAppId = log.appointment?.appointment_id_custom?.toLowerCase() || "";
        const appUuid = log.appointment_id?.toLowerCase() || "";
        return (
          recipientEmail.includes(term) ||
          recipientName.includes(term) ||
          customAppId.includes(term) ||
          appUuid.includes(term)
        );
      });
    }

    return NextResponse.json({ success: true, logs: filtered });
  } catch (error: any) {
    console.error("Fetch Email Logs Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load email logs" }, { status: 500 });
  }
}
