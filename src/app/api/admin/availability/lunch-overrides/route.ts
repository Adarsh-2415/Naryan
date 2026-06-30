import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

function timeToMinutes(timeStr: string): number {
  const [time, modifier] = timeStr.split(" ");
  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return hours * 60 + minutes;
}

export async function GET(req: NextRequest) {
  try {
    const supabaseClient = getAuthenticatedClient(req);
    const { data, error } = await supabaseClient
      .from("lunch_overrides")
      .select("*")
      .order("override_date", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, items: data || [] });
  } catch (err: any) {
    console.error("GET lunch-overrides error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch lunch overrides" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { override_date, start_time, end_time, is_active, reason } = body;

    if (!override_date || !start_time || !end_time) {
      return NextResponse.json({ error: "Date, start time, and end time are required" }, { status: 400 });
    }

    // Validate times chronologically
    const startMin = timeToMinutes(start_time);
    const endMin = timeToMinutes(end_time);
    if (startMin >= endMin) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    const start24 = convert12to24(start_time);
    const end24 = convert12to24(end_time);

    const supabaseClient = getAuthenticatedClient(req);

    // Verify uniqueness
    const { data: existing } = await supabaseClient
      .from("lunch_overrides")
      .select("id")
      .eq("override_date", override_date)
      .single();

    if (existing) {
      return NextResponse.json({ error: "A lunch override already exists for this date" }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from("lunch_overrides")
      .insert({
        override_date,
        start_time: start24,
        end_time: end24,
        is_active: is_active ?? true,
        reason: reason || null
      })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("POST lunch-overrides error:", err);
    return NextResponse.json({ error: err.message || "Failed to save lunch override" }, { status: 500 });
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
    const { start_time, end_time, is_active, reason } = body;

    // Validate times if provided
    if (start_time && end_time) {
      const startMin = timeToMinutes(start_time);
      const endMin = timeToMinutes(end_time);
      if (startMin >= endMin) {
        return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
      }
    }

    const supabaseClient = getAuthenticatedClient(req);
    const updatePayload: any = {};
    if (typeof is_active === "boolean") updatePayload.is_active = is_active;
    if (typeof reason !== "undefined") updatePayload.reason = reason || null;
    if (start_time) updatePayload.start_time = convert12to24(start_time);
    if (end_time) updatePayload.end_time = convert12to24(end_time);

    const { data, error } = await supabaseClient
      .from("lunch_overrides")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("PUT lunch-overrides error:", err);
    return NextResponse.json({ error: err.message || "Failed to update lunch override" }, { status: 500 });
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
    const { error } = await supabaseClient
      .from("lunch_overrides")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE lunch-overrides error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete lunch override" }, { status: 500 });
  }
}
