import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper to remove an asset from storage bucket
async function cleanStorageAsset(url: string, bucket: string) {
  if (!supabase || !url) return;
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length >= 2) {
      const fileName = pathParts[1];
      await supabase.storage.from(bucket).remove([fileName]);
    }
  } catch (err) {
    console.error("Cleanup asset failed:", err);
  }
}

// GET /api/admin/content/awards
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: awards, error } = await supabase
      .from("awards")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, awards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load awards" }, { status: 500 });
  }
}

// POST /api/admin/content/awards - Create or Update award
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, imageUrl, title, status, displayOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Award image is required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update award - if URL changed, clean old one
      const { data: oldAward } = await supabase
        .from("awards")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldAward && oldAward.image_url !== imageUrl) {
        await cleanStorageAsset(oldAward.image_url, "awards");
      }

      const { data, error } = await supabase
        .from("awards")
        .update({
          image_url: imageUrl,
          title: title || null,
          status: status || "published",
          display_order: displayOrder || 0
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create award
      const { data, error } = await supabase
        .from("awards")
        .insert({
          image_url: imageUrl,
          title: title || null,
          status: status || "published",
          display_order: displayOrder || 0
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, award: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save award" }, { status: 500 });
  }
}

// DELETE /api/admin/content/awards - Delete record and its file
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing award ID parameter" }, { status: 400 });
    }

    // Select the slide image URL
    const { data: awd } = await supabase
      .from("awards")
      .select("image_url")
      .eq("id", id)
      .single();

    if (awd?.image_url) {
      await cleanStorageAsset(awd.image_url, "awards");
    }

    // Delete record
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete award" }, { status: 500 });
  }
}
