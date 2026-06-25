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

// GET /api/admin/content/slider
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: slides, error } = await supabase
      .from("home_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, slides });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load slides" }, { status: 500 });
  }
}

// POST /api/admin/content/slider - Create or Update slide
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, imageUrl, title, subtitle, sortOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update slide - if imageUrl changed, clean old one
      const { data: oldSlide } = await supabase
        .from("home_slides")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldSlide && oldSlide.image_url !== imageUrl) {
        await cleanStorageAsset(oldSlide.image_url, "home-slides");
      }

      const { data, error } = await supabase
        .from("home_slides")
        .update({
          image_url: imageUrl,
          title: title || null,
          subtitle: subtitle || null,
          sort_order: sortOrder || 0
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create slide
      const { data, error } = await supabase
        .from("home_slides")
        .insert({
          image_url: imageUrl,
          title: title || null,
          subtitle: subtitle || null,
          sort_order: sortOrder || 0
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, slide: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save slide" }, { status: 500 });
  }
}

// DELETE /api/admin/content/slider - Delete slide and its file
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing slide ID parameter" }, { status: 400 });
    }

    // Select the slide image URL
    const { data: slide } = await supabase
      .from("home_slides")
      .select("image_url")
      .eq("id", id)
      .single();

    if (slide?.image_url) {
      await cleanStorageAsset(slide.image_url, "home-slides");
    }

    // Delete record
    const { error } = await supabase.from("home_slides").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete slide" }, { status: 500 });
  }
}
