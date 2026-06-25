import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

const host = process.env.EMAIL_HOST || "smtp.gmail.com";
const port = parseInt(process.env.EMAIL_PORT || "465", 10);
const user = process.env.EMAIL_USER || "";
const pass = process.env.EMAIL_PASS || "";
const from = process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <info@homoeopathy4u.com>';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

interface BookingEmailParams {
  appointmentId: string; // custom NHC- ID
  appointmentUuid?: string; // actual database UUID
  fullName: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  reason?: string;
}

/**
 * Helper to log email transmission outcomes in database
 */
async function logEmailDelivery({
  emailType,
  recipientEmail,
  recipientName,
  appointmentId,
  status,
  errorMessage,
}: {
  emailType: string;
  recipientEmail: string;
  recipientName?: string;
  appointmentId?: string;
  status: "Pending" | "Sent" | "Delivered" | "Failed";
  errorMessage?: string;
}) {
  if (!supabase) return;
  try {
    await supabase.from("email_logs").insert({
      email_type: emailType,
      recipient_email: recipientEmail,
      recipient_name: recipientName || null,
      appointment_id: appointmentId || null,
      status,
      error_message: errorMessage || null,
      sent_at: status === "Sent" || status === "Delivered" ? new Date().toISOString() : null,
    });
  } catch (err) {
    console.error("Failed to write to email_logs table:", err);
  }
}

/**
 * Helper to fetch template from Supabase, replace variables, or fall back to default
 */
async function fetchAndRenderTemplate(
  templateKey: string,
  variables: Record<string, string>,
  defaultSubject: string,
  defaultHtml: string
) {
  if (!supabase) return { subject: defaultSubject, html: defaultHtml };
  try {
    const { data: temp, error } = await supabase
      .from("email_templates")
      .select("subject, body_html")
      .eq("template_key", templateKey)
      .maybeSingle();

    if (error || !temp) {
      return { subject: defaultSubject, html: defaultHtml };
    }

    let parsedSubject = temp.subject;
    let parsedHtml = temp.body_html;

    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      parsedSubject = parsedSubject.replace(regex, val);
      parsedHtml = parsedHtml.replace(regex, val);
    });

    return { subject: parsedSubject, html: parsedHtml };
  } catch (err) {
    console.error(`Error rendering template ${templateKey}:`, err);
    return { subject: defaultSubject, html: defaultHtml };
  }
}

/**
 * Dispatches confirmation emails to both the patient and doctor.
 */
export async function sendBookingEmail(data: BookingEmailParams) {
  // If SMTP credentials are not filled, skip execution and log as failed
  if (!user || !pass) {
    const errorMsg = "SMTP credentials are not configured in env.local.";
    console.warn(errorMsg);
    
    // Log failures
    await logEmailDelivery({
      emailType: "Appointment Confirmation",
      recipientEmail: data.email,
      recipientName: data.fullName,
      appointmentId: data.appointmentUuid,
      status: "Failed",
      errorMessage: errorMsg,
    });

    await logEmailDelivery({
      emailType: "Doctor Notification",
      recipientEmail: user || "admin@homoeopathy4u.com",
      recipientName: "Doctor/Admin",
      appointmentId: data.appointmentUuid,
      status: "Failed",
      errorMessage: errorMsg,
    });

    return { success: false, reason: "Credentials missing" };
  }

  // Define variables dictionary
  const emailVars: Record<string, string> = {
    patientName: data.fullName,
    patientEmail: data.email,
    patientPhone: data.phone,
    appointmentId: data.appointmentId,
    appointmentDate: data.date,
    appointmentTime: data.time,
    clinicName: "Narayan Homoeopathic Chikitsalaya",
    clinicAddress: "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667",
    clinicPhone: "+91-1332 270021",
    clinicEmail: user || "homoeopathy4u@gmail.com"
  };

  // 1. Patient HTML Template (Fallback)
  const patientHtmlDefault = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
      <div style="text-align: center; border-bottom: 2px solid #001b4b; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #001b4b; font-family: 'Poppins', sans-serif; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Narayan Homoeopathic Chikitsalaya</h2>
        <p style="font-size: 11px; text-transform: uppercase; font-weight: bold; tracking-wider; margin: 5px 0 0 0; color: #018abe;">Appointment Confirmation</p>
      </div>
      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear <strong>${data.fullName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Your constitutional homeopathy consultation has been successfully scheduled. Details are outlined below:</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking Reference</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #018abe;">${data.appointmentId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time Slot</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #22c55e;">${data.time} (30 mins)</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  // 2. Doctor Alert HTML Template (Fallback)
  const doctorHtmlDefault = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
      <div style="border-bottom: 2px solid #001b4b; padding-bottom: 15px; margin-bottom: 25px;">
        <h2 style="color: #001b4b; font-family: 'Poppins', sans-serif; font-size: 20px; margin: 0; font-weight: 700;">New Consultation Booked</h2>
        <p style="font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 5px 0 0 0; color: #22c55e;">Alert Notification</p>
      </div>
      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">A new appointment has been scheduled in the patient registry:</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Patient Name</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Patient Phone</td>
            <td style="padding: 8px 0; text-align: right;">${data.phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Patient Email</td>
            <td style="padding: 8px 0; text-align: right;">${data.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Appointment Date</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time Slot</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #22c55e;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking ID</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #018abe;">${data.appointmentId}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  // Render templates dynamically
  const patientEmailData = await fetchAndRenderTemplate(
    "confirm_patient",
    emailVars,
    `Appointment Confirmed - ${data.appointmentId}`,
    patientHtmlDefault
  );

  const doctorEmailData = await fetchAndRenderTemplate(
    "alert_doctor",
    emailVars,
    `[ALERT] New Appointment Booking - ${data.appointmentId}`,
    doctorHtmlDefault
  );

  // Track send status for both patient and doctor
  let patientSuccess = false;
  let doctorSuccess = false;
  let patientErrorMsg = "";
  let doctorErrorMsg = "";

  try {
    // Send email to Patient
    await transporter.sendMail({
      from,
      to: data.email,
      subject: patientEmailData.subject,
      html: patientEmailData.html,
    });
    patientSuccess = true;
  } catch (error: any) {
    console.error("Nodemailer failed to transmit message to patient:", error);
    patientErrorMsg = error.message || String(error);
  }

  try {
    // Send email alert to Doctor
    await transporter.sendMail({
      from,
      to: user || "info@homoeopathy4u.com",
      subject: doctorEmailData.subject,
      html: doctorEmailData.html,
    });
    doctorSuccess = true;
  } catch (error: any) {
    console.error("Nodemailer failed to transmit message to doctor:", error);
    doctorErrorMsg = error.message || String(error);
  }

  // Log Patient Confirmation Email
  await logEmailDelivery({
    emailType: "Appointment Confirmation",
    recipientEmail: data.email,
    recipientName: data.fullName,
    appointmentId: data.appointmentUuid,
    status: patientSuccess ? "Sent" : "Failed",
    errorMessage: patientSuccess ? undefined : patientErrorMsg,
  });

  // Log Doctor Notification Email
  await logEmailDelivery({
    emailType: "Doctor Notification",
    recipientEmail: user || "info@homoeopathy4u.com",
    recipientName: "Doctor/Admin",
    appointmentId: data.appointmentUuid,
    status: doctorSuccess ? "Sent" : "Failed",
    errorMessage: doctorSuccess ? undefined : doctorErrorMsg,
  });

  return { 
    success: patientSuccess && doctorSuccess, 
    patientSuccess, 
    doctorSuccess 
  };
}


/**
 * Triggers manual resend of any logged email record.
 */
export async function resendEmailLog(logId: string) {
  if (!supabase) throw new Error("Database client not configured");

  // Fetch the log entry
  const { data: log, error } = await supabase
    .from("email_logs")
    .select("*, appointment:appointments(*, patient:patients(*))")
    .eq("id", logId)
    .single();

  if (error || !log) {
    throw new Error(error?.message || "Email log not found");
  }

  // Determine what email template to rebuild
  let htmlContent = "";
  let subject = "";

  if (log.email_type === "Appointment Confirmation" && log.appointment) {
    const app = log.appointment;
    const patientName = app.patient?.full_name || log.recipient_name || "Patient";
    const appTimeLabel = app.appointment_time; // Need to format if needed
    subject = `Appointment Confirmed - ${app.appointment_id_custom}`;
    htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; border-bottom: 2px solid #001b4b; padding-bottom: 20px; margin-bottom: 25px;">
          <h2 style="color: #001b4b; font-family: 'Poppins', sans-serif; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Narayan Homoeopathic Chikitsalaya</h2>
          <p style="font-size: 11px; text-transform: uppercase; font-weight: bold; tracking-wider; margin: 5px 0 0 0; color: #018abe;">Appointment Confirmation</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Dear <strong>${patientName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Your constitutional homeopathy consultation has been successfully scheduled. Details are outlined below:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Booking Reference</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #018abe;">${app.appointment_id_custom}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${app.appointment_date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time Slot</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #22c55e;">${appTimeLabel} (30 mins)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Center Location</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  } else if (log.email_type === "Doctor Notification" && log.appointment) {
    const app = log.appointment;
    const patientName = app.patient?.full_name || "Patient";
    const patientEmail = app.patient?.email || "";
    const patientPhone = app.patient?.phone_number || "";
    const patientAddress = app.patient?.address || "";
    subject = `[ALERT] New Appointment Booking - ${app.appointment_id_custom}`;
    htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f1f5f9; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="border-bottom: 2px solid #001b4b; padding-bottom: 15px; margin-bottom: 25px;">
          <h2 style="color: #001b4b; font-family: 'Poppins', sans-serif; font-size: 20px; margin: 0; font-weight: 700;">New Consultation Booked</h2>
          <p style="font-size: 11px; text-transform: uppercase; font-weight: bold; tracking-wider; margin: 5px 0 0 0; color: #22c55e;">Alert Notification</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">A new appointment has been scheduled in the patient registry:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Patient Name</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${patientName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${app.appointment_date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time Slot</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${app.appointment_time}</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  } else {
    // Basic fallback HTML content
    subject = `Reminder Email Notification`;
    htmlContent = `<div style="font-family: sans-serif; padding: 20px;">
      <h3>Notification Reminder</h3>
      <p>This is a resent notification email to ${log.recipient_name || "Recipient"}.</p>
    </div>`;
  }

  // Dispatch email
  try {
    await transporter.sendMail({
      from,
      to: log.recipient_email,
      subject,
      html: htmlContent,
    });

    // Update log
    await supabase
      .from("email_logs")
      .update({
        status: "Sent",
        error_message: null,
        sent_at: new Date().toISOString(),
      })
      .eq("id", logId);

    return { success: true };
  } catch (error: any) {
    console.error("Nodemailer resend failed:", error);
    
    // Update log with new error message
    await supabase
      .from("email_logs")
      .update({
        status: "Failed",
        error_message: error.message || String(error),
      })
      .eq("id", logId);

    throw error;
  }
}

