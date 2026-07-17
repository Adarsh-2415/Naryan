import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { transporter } from "@/lib/email/transporter";

function parseAppointmentDateTime(dateStr: string, timeStr: string): Date {
  const parts = timeStr.trim().split(" ");
  const time = parts[0];
  const modifier = parts[1]; // "AM", "PM" or undefined

  let [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (modifier) {
    if (hours === 12) hours = 0;
    if (modifier === "PM") hours += 12;
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}


export async function GET(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Fetch confirmed appointments for today & tomorrow where reminder is not yet sent
    const { data: appointments, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .in("appointment_date", [todayStr, tomorrowStr])
      .eq("status", "confirmed")
      .or("reminder_sent.eq.false,reminder_sent.is.null");

    if (fetchError) {
      console.error("Cron fetch appointments error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ success: true, message: "No pending reminders found for today or tomorrow." });
    }

    const now = new Date();
    const sentList: string[] = [];
    const failedList: any[] = [];

    for (const app of appointments) {
      const appDateTime = parseAppointmentDateTime(app.appointment_date, app.appointment_time);
      const diffMs = appDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Check if appointment is 2 hours before (window between 0 and 2.5 hours)
      if (diffHours >= 0 && diffHours <= 2.5) {
        try {
          const bookingRef = app.id.substring(0, 8).toUpperCase();
          
          const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div class="header" style="font-size: 22px; font-weight: 700; color: #001b4b; text-align: center; margin-bottom: 4px;">Narayan Homoeopathic Chikitsalaya</div>
    <div class="subheader" style="font-size: 13px; color: #e11d48; text-align: center; font-weight: bold; margin-bottom: 24px;">APPOINTMENT REMINDER (TODAY)</div>
    <div class="divider" style="height: 1.5px; background-color: #e11d48; margin-bottom: 24px;"></div>
    
    <div class="greeting" style="font-size: 14px; color: #0f172a; font-weight: 600; margin-bottom: 12px;">Dear <span style="text-transform: uppercase;">${app.full_name}</span>,</div>
    
    <div class="content-text" style="font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5;">
      This is a friendly reminder that you have an upcoming homeopathy consultation scheduled in <strong>2 hours</strong>. Please review your details below:
    </div>

    <div class="details-card" style="background-color: #fff1f2; border-radius: 12px; border: 1px solid #fecdd3; padding: 24px; margin-bottom: 24px;">
      <table class="details-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Patient Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right; text-transform: uppercase;">${app.full_name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Booking Reference</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${bookingRef}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Appointment Date</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${app.appointment_date}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Appointment Time</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #be123c; font-weight: 700; text-align: right;">${app.appointment_time} (10 mins)</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Doctor / Clinic</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">Narayan Homoeopathic Chikitsalaya</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Clinic Address</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #fecdd3; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #9f1239; font-weight: 600; width: 35%; text-align: left;">Contact Number</td>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">+91-1332 270021</td>
        </tr>
      </table>
    </div>

    <div class="button-container" style="text-align: center; margin: 32px 0;">
      <a href="https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee" class="button" style="display: inline-block; background-color: #be123c; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 36px; border-radius: 99px;">View Clinic Location</a>
    </div>

    <div class="dashed-divider" style="border-top: 1px dashed #e2e8f0; margin-bottom: 24px;"></div>

    <div class="footer" style="text-align: center; font-size: 11px; color: #94a3b8;">
      If you need to reschedule or cancel your appointment, please contact us immediately at +91-1332 270021.
    </div>
  </div>
</body>
</html>
          `;

          await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <homoeopathy4u@gmail.com>',
            to: app.email,
            subject: `Reminder: Your Appointment is Today – Narayan Homoeopathic Chikitsalaya`,
            html,
          });

          // Mark reminder_sent = true in Database immediately
          await supabase
            .from("appointments")
            .update({ reminder_sent: true })
            .eq("id", app.id);

          sentList.push(app.id);
        } catch (mailError: any) {
          console.error(`Failed to send reminder for appointment ID ${app.id}:`, mailError);
          failedList.push({ id: app.id, error: mailError.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: appointments.length,
      sentCount: sentList.length,
      sentList,
      failedCount: failedList.length,
      failedList
    });
  } catch (error: any) {
    console.error("Reminder Scheduler API Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to trigger cron reminders" }, { status: 500 });
  }
}
