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

export async function GET(req: NextRequest) {
  try {
    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data, error } = await supabaseClient
      .from("availability_exceptions")
      .select("*")
      .eq("type", "holiday")
      .order("exception_date", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, items: data || [] });
  } catch (err: any) {
    console.error("GET holidays error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch holidays" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exception_date, reason, is_active } = body;

    if (!exception_date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const supabaseClient = getAuthenticatedClient(req);
    if (!(await verifyAdmin(supabaseClient))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify uniqueness
    const { data: existing } = await supabaseClient
      .from("availability_exceptions")
      .select("id")
      .eq("exception_date", exception_date)
      .single();

    if (existing) {
      return NextResponse.json({ error: "A rule already exists for this date" }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from("availability_exceptions")
      .insert({ exception_date, type: "holiday", reason: reason || null, is_active: is_active ?? true })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("POST holidays error:", err);
    return NextResponse.json({ error: err.message || "Failed to create holiday" }, { status: 500 });
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
      .from("availability_exceptions")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error("PUT holidays error:", err);
    return NextResponse.json({ error: err.message || "Failed to update holiday" }, { status: 500 });
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
      .from("availability_exceptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE holidays error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete holiday" }, { status: 500 });
  }
}
