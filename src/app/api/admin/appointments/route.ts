import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// GET /api/admin/appointments - List and filter appointments
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    let query = supabase
      .from("appointments")
      .select("*, patient:patients(*)")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });

    // Apply status filter
    if (status) {
      query = query.eq("status", status);
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte("appointment_date", startDate);
    }
    if (endDate) {
      query = query.lte("appointment_date", endDate);
    }

    const { data: appointments, error } = await query;
    if (error) throw error;

    // Apply client-side text search filter to matches in patients name/email or appointment custom ID
    let filtered = appointments || [];
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((app: any) => {
        const patientName = app.patient?.full_name?.toLowerCase() || "";
        const patientEmail = app.patient?.email?.toLowerCase() || "";
        const patientPhone = app.patient?.phone_number?.toLowerCase() || "";
        const customId = app.appointment_id_custom?.toLowerCase() || "";
        return (
          patientName.includes(term) ||
          patientEmail.includes(term) ||
          patientPhone.includes(term) ||
          customId.includes(term)
        );
      });
    }

    return NextResponse.json({ success: true, appointments: filtered });
  } catch (error: any) {
    console.error("Fetch Appointments Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load appointments" }, { status: 500 });
  }
}

// PATCH /api/admin/appointments - Update appointment status
export async function PATCH(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status parameters" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select("*, patient:patients(*)")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, appointment: data });
  } catch (error: any) {
    console.error("Update Appointment Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to update appointment status" }, { status: 500 });
  }
}
