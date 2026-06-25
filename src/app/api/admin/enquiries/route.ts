import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// GET /api/admin/enquiries
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: enquiries, error } = await supabase
      .from("contact_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    console.error("Fetch Enquiries Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to load enquiries" }, { status: 500 });
  }
}

// PATCH /api/admin/enquiries - Mark as read/unread
export async function PATCH(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, is_read } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing enquiry ID parameter" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contact_enquiries")
      .update({ is_read })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, enquiry: data });
  } catch (error: any) {
    console.error("Update Enquiry Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to update enquiry status" }, { status: 500 });
  }
}

// DELETE /api/admin/enquiries - Delete enquiry
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing enquiry ID parameter" }, { status: 400 });
    }

    const { error } = await supabase
      .from("contact_enquiries")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Enquiry Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to delete enquiry" }, { status: 500 });
  }
}
