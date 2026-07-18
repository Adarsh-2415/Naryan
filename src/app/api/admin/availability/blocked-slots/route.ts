import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/roles";

function getAuthenticatedClient(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  });
}

function convert12to24(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return `${hours.toString().padStart(2, "0")}:${minutesStr}:00`;
}

export async function GET(req: NextRequest) {
  try {
    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data, error } = await supabaseClient
      .from("blocked_slots")
      .select("*")
      .order("blocked_date", { ascending: true })
      .order("slot_time", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, items: data || [] });
  } catch (err: any) {
    console.error("GET blocked-slots error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch blocked slots" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blocked_date, slot_time, reason, is_active } = body;

    if (!blocked_date || !slot_time) {
      return NextResponse.json({ error: "Date and slot time are required" }, { status: 400 });
    }

    const time24h = convert12to24(slot_time);
    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify duplicate slot constraint
    const { data: existing } = await supabaseClient
      .from("blocked_slots")
      .select("id")
      .eq("blocked_date", blocked_date)
      .eq("slot_time", time24h)
      .single();

    if (existing) {
      return NextResponse.json({ error: `Slot ${slot_time} is already blocked on this date` }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from("blocked_slots")
      .insert({
        blocked_date,
        slot_time: time24h,
        reason: reason || null,
        is_active: is_active ?? true
      })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("POST blocked-slots error:", err);
    return NextResponse.json({ error: err.message || "Failed to block slot" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();
    const { reason, is_active } = body;
    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatePayload: any = {};
    if (typeof is_active === "boolean") updatePayload.is_active = is_active;
    if (typeof reason !== "undefined") updatePayload.reason = reason || null;

    const { data, error } = await supabaseClient
      .from("blocked_slots")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("PUT blocked-slots error:", err);
    return NextResponse.json({ error: err.message || "Failed to update blocked slot" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { error } = await supabaseClient
      .from("blocked_slots")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE blocked-slots error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete blocked slot" }, { status: 500 });
  }
}
