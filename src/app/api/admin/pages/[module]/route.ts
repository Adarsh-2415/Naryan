import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Map URL module path keys to correct database tables
const MODULE_TABLES: Record<string, string> = {
  "gallery": "gallery",
  "awards": "awards",
  "case-studies": "case_studies",
  "seminars": "seminars",
  "treatments": "treatments",
  "global-settings": "global_settings",
  "testimonials": "testimonials"
};

// GET handler
export async function GET(req: NextRequest, props: { params: Promise<{ module: string }> }) {
  const params = await props.params;
  const moduleName = params.module;
  const table = MODULE_TABLES[moduleName];
  if (!table) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  try {
    const url = new URL(req.url);
    const publishedOnly = url.searchParams.get("published") === "true";
    const supabaseClient = getAuthenticatedClient(req);

    let query = supabaseClient.from(table).select("*");

    // Standard public query defaults to published only
    if (publishedOnly && table !== "global_settings") {
      query = query.eq("status", "published");
    }

    // Default sorting order
    if (table !== "global_settings") {
      query = query.order("display_order", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    // Settings returns a single configuration object instead of listing
    if (table === "global_settings") {
      return NextResponse.json({ success: true, settings: data?.[0] || null });
    }

    return NextResponse.json({ success: true, items: data || [] });
  } catch (err: any) {
    console.error(`Error loading table ${table}:`, err);
    return NextResponse.json({ error: err.message || "Failed to retrieve content" }, { status: 500 });
  }
}

function getAuthenticatedClient(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  });
}

// POST handler (Create Draft)
export async function POST(req: NextRequest, props: { params: Promise<{ module: string }> }) {
  const params = await props.params;
  const moduleName = params.module;
  const table = MODULE_TABLES[moduleName];
  if (!table) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const supabaseClient = getAuthenticatedClient(req);

    // Enforce default workflow state
    if (table !== "global_settings") {
      body.status = "draft";
    }

    const { data, error } = await supabaseClient
      .from(table)
      .insert(body)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error(`Post error for ${table}:`, err);
    return NextResponse.json({ error: err.message || "Failed to create draft" }, { status: 500 });
  }
}

// PUT handler (Update details or publish status)
export async function PUT(req: NextRequest, props: { params: Promise<{ module: string }> }) {
  const params = await props.params;
  const moduleName = params.module;
  const table = MODULE_TABLES[moduleName];
  if (!table) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const supabaseClient = getAuthenticatedClient(req);

    // Check if it's a batch drag-and-drop display order sync
    const isReorder = url.searchParams.get("action") === "reorder";

    if (isReorder && Array.isArray(body)) {
      // Loop reorder items concurrently
      const promises = body.map(async (row: { id: string; display_order: number }) => {
        return supabaseClient.from(table).update({ display_order: row.display_order }).eq("id", row.id);
      });
      const results = await Promise.all(promises);
      const failed = results.find(r => r.error);
      if (failed) throw failed.error;

      return NextResponse.json({ success: true });
    }

    if (table === "global_settings") {
      // For global settings, update the single active config row
      const { data: currentRows } = await supabaseClient.from("global_settings").select("id");
      const targetId = currentRows?.[0]?.id;

      let result;
      if (targetId) {
        result = await supabaseClient.from("global_settings").update(body).eq("id", targetId).select("*").single();
      } else {
        result = await supabaseClient.from("global_settings").insert(body).select("*").single();
      }

      if (result.error) throw result.error;
      return NextResponse.json({ success: true, settings: result.data });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing parameter ID" }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from(table)
      .update(body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error(`Put error for ${table}:`, err);
    return NextResponse.json({ error: err.message || "Failed to update record" }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req: NextRequest, props: { params: Promise<{ module: string }> }) {
  const params = await props.params;
  const moduleName = params.module;
  const table = MODULE_TABLES[moduleName];
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!table || !id) {
    return NextResponse.json({ error: "Missing ID or invalid module" }, { status: 400 });
  }

  try {
    const supabaseClient = getAuthenticatedClient(req);

    // 1. Retrieve the existing record so we can clean up any associated storage files
    const { data: record, error: getError } = await supabaseClient
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;

    // 2. Perform the database deletion
    const { error: deleteError } = await supabaseClient
      .from(table)
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // 3. Clear file items out of Supabase Storage bucket using storage_path references
    const pathsToClean: string[] = [];

    if (record.storage_path) {
      pathsToClean.push(record.storage_path);
    }
    if (record.cover_image_storage_path) {
      pathsToClean.push(record.cover_image_storage_path);
    }
    if (record.before_image_storage_path) {
      pathsToClean.push(record.before_image_storage_path);
    }
    if (record.after_image_storage_path) {
      pathsToClean.push(record.after_image_storage_path);
    }

    if (pathsToClean.length > 0) {
      await supabaseClient.storage.from("cms-media").remove(pathsToClean);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`Delete error for ${table}:`, err);
    return NextResponse.json({ error: err.message || "Failed to delete record" }, { status: 500 });
  }
}
