import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// GET /api/admin/templates
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: templates, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("template_key", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load templates" }, { status: 500 });
  }
}

// POST /api/admin/templates - Edit template & archive version history
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, subject, bodyHtml } = body;

    if (!id || !subject || !bodyHtml) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 1. Fetch current version to archive
    const { data: currentTemp, error: getErr } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (getErr || !currentTemp) {
      return NextResponse.json({ error: "Email template not found" }, { status: 404 });
    }

    // 2. Insert into template versions history
    const { error: histErr } = await supabase
      .from("email_template_versions")
      .insert({
        template_id: currentTemp.id,
        subject: currentTemp.subject,
        body_html: currentTemp.body_html,
        version: currentTemp.version
      });

    if (histErr) throw histErr;

    // 3. Update main template and increment version number
    const newVersion = currentTemp.version + 1;
    const { data: updated, error: upErr } = await supabase
      .from("email_templates")
      .update({
        subject,
        body_html: bodyHtml,
        version: newVersion,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (upErr) throw upErr;

    return NextResponse.json({ success: true, template: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save template" }, { status: 500 });
  }
}
