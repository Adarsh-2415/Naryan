import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST || "smtp.gmail.com";
const port = parseInt(process.env.EMAIL_PORT || "465", 10);
const user = process.env.EMAIL_USER || "";
const pass = process.env.EMAIL_PASS || "";
const from = process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <info@homoeopathy4u.com>';

// POST /api/admin/templates/test
export async function POST(req: NextRequest) {
  try {
    if (!user || !pass) {
      return NextResponse.json(
        { error: "SMTP credentials are not configured. Add EMAIL_USER and EMAIL_PASS to .env.local." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { subject, bodyHtml, testEmail } = body;

    if (!subject || !bodyHtml || !testEmail) {
      return NextResponse.json({ error: "Missing subject, bodyHtml, or testEmail" }, { status: 400 });
    }

    // Replace template variables with sample preview values
    const sampleVars: Record<string, string> = {
      patientName: "Dr. Sample Patient",
      patientEmail: testEmail,
      patientPhone: "+91 98765 43210",
      appointmentId: "NHC-PREVIEW-001",
      appointmentDate: new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      appointmentTime: "10:30 AM",
      clinicName: "Narayan Homoeopathic Chikitsalaya",
      clinicAddress: "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667",
      clinicPhone: "+91-1332 270021",
      clinicEmail: "homoeopathy4u@gmail.com",
    };

    let renderedSubject = subject;
    let renderedHtml = bodyHtml;

    Object.entries(sampleVars).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedSubject = renderedSubject.replace(regex, val);
      renderedHtml = renderedHtml.replace(regex, val);
    });

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from,
      to: testEmail,
      subject: `[PREVIEW] ${renderedSubject}`,
      html: renderedHtml,
    });

    return NextResponse.json({ success: true, message: `Test email sent to ${testEmail}` });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json({ error: error.message || "Failed to send test email" }, { status: 500 });
  }
}
