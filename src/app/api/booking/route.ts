import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmail } from "@/lib/email";

// Initialize backend Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, address, age, gender, reason, date, time } = body;

    // Basic server-side validations
    if (!fullName || !email || !phone || !address || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `NHC-${year}-${randomSeq}`;

    if (supabase) {
      // 1. Check or insert patient record
      let patientId;
      const { data: existingPatient } = await supabase
        .from("patients")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: pError } = await supabase
          .from("patients")
          .insert({
            full_name: fullName,
            email: email,
            phone_number: phone,
            address: address,
            age: age ? parseInt(age) : null,
            gender: gender || null
          })
          .select("id")
          .single();

        if (pError) throw pError;
        patientId = newPatient.id;
      }

      // Convert selected 12h time label to 24h format (e.g. "09:30 AM" -> "09:30:00")
      const [timeStr, modifier] = time.split(" ");
      let [hours, minutes] = timeStr.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      const time24 = `${hours.padStart(2, "0")}:${minutes}:00`;

      // 2. Double Booking Lock Protection check
      const { data: conflicts } = await supabase
        .from("appointments")
        .select("id")
        .eq("appointment_date", date)
        .eq("appointment_time", time24)
        .neq("status", "cancelled");

      if (conflicts && conflicts.length >= 1) {
        return NextResponse.json({ error: "This slot is already booked" }, { status: 409 });
      }

      // 3. Insert Appointment
      const { data: newApp, error: appError } = await supabase
        .from("appointments")
        .insert({
          appointment_id_custom: generatedId,
          patient_id: patientId,
          appointment_date: date,
          appointment_time: time24,
          reason_for_visit: reason || null,
          status: "confirmed"
        })
        .select("id")
        .single();

      if (appError) throw appError;

      // 4. Send Confirmation & Alert Emails via SMTP
      await sendBookingEmail({
        appointmentId: generatedId,
        appointmentUuid: newApp?.id,
        fullName,
        email,
        phone,
        address,
        date,
        time,
        reason
      });
    } else {
      // 4. Fallback when Supabase is not loaded
      await sendBookingEmail({
        appointmentId: generatedId,
        fullName,
        email,
        phone,
        address,
        date,
        time,
        reason
      });
    }

    return NextResponse.json({ success: true, appointmentId: generatedId });
  } catch (error: any) {
    console.error("Booking handler API exception:", error);
    return NextResponse.json({ error: error.message || "Failed to process booking" }, { status: 500 });
  }
}

