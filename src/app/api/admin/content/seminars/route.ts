import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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

// GET /api/admin/content/seminars
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: seminars, error } = await supabase
      .from("seminars")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, seminars });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load seminars" }, { status: 500 });
  }
}

// POST /api/admin/content/seminars
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { 
      id, 
      title, 
      description, 
      imageUrl, 
      status, 
      displayOrder, 
      seoTitle, 
      seoDescription 
    } = body;

    // A seminar must have at least an image
    if (!imageUrl) {
      return NextResponse.json({ error: "Seminar image is required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update seminar
      const { data: oldSem } = await supabase
        .from("seminars")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldSem && oldSem.image_url && oldSem.image_url !== imageUrl) {
        await cleanStorageAsset(oldSem.image_url, "seminars");
      }

      const { data, error } = await supabase
        .from("seminars")
        .update({
          title: title || null,
          description: description || null,
          image_url: imageUrl,
          status: status || "published",
          display_order: displayOrder || 0,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create seminar
      const { data, error } = await supabase
        .from("seminars")
        .insert({
          title: title || null,
          description: description || null,
          image_url: imageUrl,
          status: status || "published",
          display_order: displayOrder || 0,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, seminar: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save seminar" }, { status: 500 });
  }
}

// DELETE /api/admin/content/seminars
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing seminar ID parameter" }, { status: 400 });
    }

    const { data: s } = await supabase
      .from("seminars")
      .select("image_url")
      .eq("id", id)
      .single();

    if (s?.image_url) {
      await cleanStorageAsset(s.image_url, "seminars");
    }

    const { error } = await supabase.from("seminars").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete seminar" }, { status: 500 });
  }
}
