import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendContactNotification } from "@/lib/email/sendContactNotification";

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const { name, email = "", phone, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contact_queries")
      .insert({
        name,
        email,
        phone,
        message
      })
      .select("id")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger Admin Email notification asynchronously
    sendContactNotification({ name, email, phone, message }).catch(err => {
      console.error("Failed to trigger contact mail notification:", err);
    });

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Unexpected enquiries API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
