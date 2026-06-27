import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const activities = [
      {
        id: "app-mock-1",
        type: "appointment",
        message: "New appointment NHC-2026-9500 booked by Deepak Mathur",
        timestamp: new Date().toISOString(),
      },
      {
        id: "app-mock-2",
        type: "appointment",
        message: "New appointment NHC-2026-3202 booked by Gautum Sharma",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "fail-mock-1",
        type: "email_failure",
        message: "Failed to deliver Doctor Notification to admin@homoeopathy4u.com",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        meta: { error: "SMTP connect ETIMEDOUT" }
      }
    ];

    return NextResponse.json({
      success: true,
      stats: {
        todayAppointments: 2,
        upcomingAppointments: 8,
        totalTreatments: 12,
        totalGalleryImages: 8,
        totalTestimonials: 6,
        totalAwards: 4,
        totalCaseStudies: 5,
        totalSeminars: 3,
        unreadEnquiries: 4,
        emails: {
          sentToday: 18,
          failedToday: 1,
          pendingToday: 0,
        },
      },
      recentActivity: activities,
    });
  } catch (error: any) {
    console.error("Dashboard Stats Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard metrics" }, { status: 500 });
  }
}
