import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendPatientConfirmation } from "@/lib/email/sendPatientConfirmation";
import { sendDoctorNotification } from "@/lib/email/sendDoctorNotification";
import { BASE_SLOTS } from "@/lib/bookingConfig";

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // 1. Basic validation
    const { fullName, email, phone, address, age, gender, reason, date, time, previousBookingReference } = body;
    
    if (!fullName || !email || !phone || !address || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!BASE_SLOTS.includes(time)) {
      return NextResponse.json({ error: "Invalid appointment slot selected" }, { status: 400 });
    }
    
    // 2. Validate against past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(date);
    
    if (selectedDateObj < today) {
      return NextResponse.json({ error: "Cannot book an appointment in the past" }, { status: 400 });
    }
    
    // 3. Validate against past time slots for today
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) {
      const now = new Date();
      const [timeStr, modifier] = time.split(" ");
      let [hoursStr, minutesStr] = timeStr.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      if (hours === 12) hours = 0;
      if (modifier === "PM") hours += 12;
      
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      if (now > slotTime) {
        return NextResponse.json({ error: "Cannot book a past time slot for today" }, { status: 400 });
      }
    }
    
    // 4. Double booking prevention
    const { data: existingBookings, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("appointment_time", time)
      .neq("status", "cancelled");
      
    if (checkError) {
      console.error("Database check error:", checkError);
      return NextResponse.json({ error: "Failed to verify slot availability" }, { status: 500 });
    }
    
    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: "This slot is already booked. Please select another time." }, { status: 409 });
    }
    
    // 5. Generate Appointment ID using prefix or DB UUID. The UI expects an ID like NHC-YYYY-XXXX.
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `NHC-${year}-${randomSeq}`;

    // Verify returning patient reference matches database record case-insensitively
    let isReturning = false;
    if (previousBookingReference) {
      const cleanRef = previousBookingReference.trim().toUpperCase();
      const cleanPhone = phone.trim();

      const { data: record } = await supabase
        .from("patient_records")
        .select("phone")
        .eq("booking_reference", cleanRef)
        .maybeSingle();

      if (record && record.phone.trim() === cleanPhone) {
        isReturning = true;
      } else {
        const { data: appRecord } = await supabase
          .from("appointments")
          .select("phone")
          .eq("booking_reference", cleanRef)
          .maybeSingle();

        if (appRecord && appRecord.phone.trim() === cleanPhone) {
          isReturning = true;
        }
      }
    }
    
    const bookingData = {
      appointmentId,
      fullName,
      email,
      phone,
      address,
      age: age ? parseInt(age) : 0,
      gender: gender || "",
      reason: reason || "",
      date,
      timeSlot: time,
      isReturningPatient: isReturning,
      previousBookingReference: isReturning ? previousBookingReference.trim().toUpperCase() : null
    };
    
    // 6. Dispatch Emails concurrently
    const emailResults = await Promise.allSettled([
      sendPatientConfirmation(bookingData),
      sendDoctorNotification(bookingData)
    ]);
    
    // Check if at least the patient confirmation was sent successfully
    const patientMailResult = emailResults[0];
    const isPatientSent = patientMailResult.status === 'fulfilled' && patientMailResult.value.success;
    
    // 7. Database Insertion with final email status values
    const { data: insertedData, error: insertError } = await supabase
      .from("appointments")
      .insert({
        full_name: fullName,
        email: email,
        phone: phone,
        address: address,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        reason: reason || null,
        appointment_date: date,
        appointment_time: time,
        status: "confirmed",
        email_status: isPatientSent ? "sent" : "failed",
        email_sent_at: isPatientSent ? new Date().toISOString() : null,
        booking_reference: appointmentId,
        previous_booking_reference: isReturning ? previousBookingReference.trim().toUpperCase() : null,
        is_returning_patient: isReturning
      })
      .select("id")
      .single();
      
    if (insertError || !insertedData) {
      console.error("Database insert error:", insertError);
      return NextResponse.json({ 
        error: `Supabase Error: ${insertError?.message || "Failed to save booking"}` 
      }, { status: 500 });
    }

    // 8. Upsert patient record targeting unique email address
    const { error: upsertError } = await supabase
      .from("patient_records")
      .upsert(
        {
          full_name: fullName,
          email: email,
          phone: phone,
          address: address,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          booking_reference: appointmentId,
          appointment_booked_on: new Date().toISOString(),
          appointment_date: date,
          appointment_time: time,
          updated_at: new Date().toISOString()
        },
        { onConflict: "email" }
      );

    if (upsertError) {
      console.error("Patient record upsert warning (non-blocking):", upsertError);
    }
    
    return NextResponse.json({ success: true, appointmentId });
    
  } catch (error) {
    console.error("Unexpected booking error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
