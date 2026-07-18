import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getUserRole } from "@/lib/roles";

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
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

    // Get authenticated user role
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = getUserRole(user);

    // Queries templates
    const totalQuery = supabaseClient.from("appointments").select("id", { count: "exact", head: true }).neq("status", "cancelled");
    const todayQuery = supabaseClient.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", todayStr).neq("status", "cancelled");
    const upcomingQuery = supabaseClient.from("appointments").select("id", { count: "exact", head: true }).gt("appointment_date", todayStr).neq("status", "cancelled");
    const monthQuery = supabaseClient.from("appointments").select("id", { count: "exact", head: true }).gte("appointment_date", firstDayOfMonth).neq("status", "cancelled");

    let totalCount = 0, todayCount = 0, upcomingCount = 0, monthCount = 0, queriesCount = 0, galleryCount = 0;

    if (role === "admin") {
      const [
        { count: resTotal, error: errTotal },
        { count: resToday, error: errToday },
        { count: resUpcoming, error: errUpcoming },
        { count: resMonth, error: errMonth },
        { count: resQueries, error: errQueries },
        { count: resGallery, error: errGallery }
      ] = await Promise.all([
        totalQuery,
        todayQuery,
        upcomingQuery,
        monthQuery,
        supabaseClient.from("contact_queries").select("id", { count: "exact", head: true }),
        supabaseClient.from("gallery").select("id", { count: "exact", head: true }).eq("status", "published")
      ]);

      if (errTotal || errToday || errUpcoming || errMonth || errQueries || errGallery) {
        const err = errTotal || errToday || errUpcoming || errMonth || errQueries || errGallery;
        throw new Error(err?.message || "Error running database stats count queries");
      }

      totalCount = resTotal || 0;
      todayCount = resToday || 0;
      upcomingCount = resUpcoming || 0;
      monthCount = resMonth || 0;
      queriesCount = resQueries || 0;
      galleryCount = resGallery || 0;
    } else {
      // Receptionist: only query appointments
      const [
        { count: resTotal, error: errTotal },
        { count: resToday, error: errToday },
        { count: resUpcoming, error: errUpcoming },
        { count: resMonth, error: errMonth }
      ] = await Promise.all([
        totalQuery,
        todayQuery,
        upcomingQuery,
        monthQuery
      ]);

      if (errTotal || errToday || errUpcoming || errMonth) {
        const err = errTotal || errToday || errUpcoming || errMonth;
        throw new Error(err?.message || "Error running database stats count queries");
      }

      totalCount = resTotal || 0;
      todayCount = resToday || 0;
      upcomingCount = resUpcoming || 0;
      monthCount = resMonth || 0;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAppointments: totalCount,
        todayAppointments: todayCount,
        upcomingAppointments: upcomingCount,
        monthAppointments: monthCount,
        contactQueries: queriesCount,
        publishedGalleryItems: galleryCount
      }
    });
  } catch (error: any) {
    console.error("Dashboard Stats Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard metrics" }, { status: 500 });
  }
}
