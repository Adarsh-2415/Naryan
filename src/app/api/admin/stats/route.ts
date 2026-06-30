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

export async function GET(req: NextRequest) {
  try {
    const supabaseClient = getAuthenticatedClient(req);
    const todayStr = new Date().toISOString().split("T")[0];

    // Run count queries concurrently from real-time Supabase tables
    const [
      { count: totalCount, error: errTotal },
      { count: todayCount, error: errToday },
      { count: upcomingCount, error: errUpcoming },
      { count: queriesCount, error: errQueries },
      { count: galleryCount, error: errGallery }
    ] = await Promise.all([
      supabaseClient.from("appointments").select("id", { count: "exact", head: true }).neq("status", "cancelled"),
      supabaseClient.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", todayStr).neq("status", "cancelled"),
      supabaseClient.from("appointments").select("id", { count: "exact", head: true }).gt("appointment_date", todayStr).neq("status", "cancelled"),
      supabaseClient.from("contact_queries").select("id", { count: "exact", head: true }),
      supabaseClient.from("gallery").select("id", { count: "exact", head: true }).eq("status", "published")
    ]);

    if (errTotal || errToday || errUpcoming || errQueries || errGallery) {
      const err = errTotal || errToday || errUpcoming || errQueries || errGallery;
      throw new Error(err?.message || "Error running database stats count queries");
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAppointments: totalCount || 0,
        todayAppointments: todayCount || 0,
        upcomingAppointments: upcomingCount || 0,
        contactQueries: queriesCount || 0,
        publishedGalleryItems: galleryCount || 0
      }
    });
  } catch (error: any) {
    console.error("Dashboard Stats Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard metrics" }, { status: 500 });
  }
}
