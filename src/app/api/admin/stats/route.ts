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

    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Today's Appointments
    const { count: todayCount, error: todayErr } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", todayStr)
      .neq("status", "cancelled");

    // 2. Upcoming Appointments
    const { count: upcomingCount, error: upErr } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gt("appointment_date", todayStr)
      .neq("status", "cancelled");

    // 3. Email log counters for today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const { data: todayEmails, error: emailErr } = await supabase
      .from("email_logs")
      .select("status")
      .gte("created_at", startOfToday.toISOString())
      .lte("created_at", endOfToday.toISOString());

    let sentToday = 0;
    let failedToday = 0;
    let pendingToday = 0;

    if (todayEmails) {
      todayEmails.forEach((log) => {
        if (log.status === "Sent" || log.status === "Delivered") sentToday++;
        else if (log.status === "Failed") failedToday++;
        else if (log.status === "Pending") pendingToday++;
      });
    }

    // 4. Contact Enquiries Count
    const { count: unreadEnquiriesCount } = await supabase
      .from("contact_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    // 5. Total counts for other items (using fallbacks for non-existent content tables)
    const getCount = async (table: string, fallbackVal: number) => {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        if (error) throw error;
        return count !== null ? count : fallbackVal;
      } catch {
        return fallbackVal;
      }
    };

    const totalTreatments = await getCount("treatments", 12);
    const totalGalleryImages = await getCount("gallery", 8);
    const totalTestimonials = await getCount("testimonials", 6);
    const totalAwards = await getCount("awards", 4);
    const totalCaseStudies = await getCount("case_studies", 5);
    const totalSeminars = await getCount("seminars", 3);

    // 6. Recent Activity Feed
    const { data: recentAppointments } = await supabase
      .from("appointments")
      .select("*, patient:patients(full_name)")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentFailures } = await supabase
      .from("email_logs")
      .select("*")
      .eq("status", "Failed")
      .order("created_at", { ascending: false })
      .limit(3);

    const activities: Array<{
      id: string;
      type: "appointment" | "email_failure" | "enquiry" | "content";
      message: string;
      timestamp: string;
      meta?: any;
    }> = [];

    if (recentAppointments) {
      recentAppointments.forEach((app) => {
        activities.push({
          id: `app-${app.id}`,
          type: "appointment",
          message: `New appointment ${app.appointment_id_custom} booked by ${app.patient?.full_name || "Patient"}`,
          timestamp: app.created_at,
        });
      });
    }

    if (recentFailures) {
      recentFailures.forEach((log) => {
        activities.push({
          id: `fail-${log.id}`,
          type: "email_failure",
          message: `Failed to deliver ${log.email_type} to ${log.recipient_email}`,
          timestamp: log.created_at,
          meta: { error: log.error_message },
        });
      });
    }

    // Sort all activities by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      stats: {
        todayAppointments: todayCount || 0,
        upcomingAppointments: upcomingCount || 0,
        totalTreatments,
        totalGalleryImages,
        totalTestimonials,
        totalAwards,
        totalCaseStudies,
        totalSeminars,
        unreadEnquiries: unreadEnquiriesCount || 0,
        emails: {
          sentToday,
          failedToday,
          pendingToday,
        },
      },
      recentActivity: activities.slice(0, 8),
    });
  } catch (error: any) {
    console.error("Dashboard Stats Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard metrics" }, { status: 500 });
  }
}
