import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const { bookingReference, email } = await req.json();

    if (!bookingReference || !email) {
      return NextResponse.json({ error: "Missing booking reference or email" }, { status: 400 });
    }

    const cleanRef = bookingReference.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Query appointments table using booking_reference + email (case-insensitively via post-filter comparison)
    const { data: appointment, error: appError } = await supabase
      .from("appointments")
      .select("full_name, email, phone, address, age, gender")
      .eq("booking_reference", cleanRef)
      .maybeSingle();

    if (appError) {
      console.error("Error querying appointments:", appError);
    }

    if (!appointment || appointment.email.trim().toLowerCase() !== cleanEmail) {
      return NextResponse.json({ 
        error: "Details do not match our records. Please verify the code and email, or fill the details manually." 
      }, { status: 404 });
    }

    // 2. Load the latest patient profile from patient_records using the matched email
    const { data: profile, error: profileError } = await supabase
      .from("patient_records")
      .select("full_name, email, phone, address, age, gender")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (profileError) {
      console.error("Error querying patient_records:", profileError);
    }

    // Return patient details prioritizing latest profile, falling back to the appointment record if profile doesn't exist
    const patientDetails = profile ? {
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      age: profile.age,
      gender: profile.gender
    } : {
      full_name: appointment.full_name,
      email: appointment.email,
      phone: appointment.phone,
      address: appointment.address,
      age: appointment.age,
      gender: appointment.gender
    };

    return NextResponse.json({ success: true, patient: patientDetails });

  } catch (error: any) {
    console.error("Verification API Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to verify patient" }, { status: 500 });
  }
}
