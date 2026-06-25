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

// GET /api/admin/content/gallery
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: images, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load gallery" }, { status: 500 });
  }
}

// POST /api/admin/content/gallery - Create or Update image record
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { id, imageUrl, caption, status, sortOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update image - if URL changed, clean old one
      const { data: oldImg } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldImg && oldImg.image_url !== imageUrl) {
        await cleanStorageAsset(oldImg.image_url, "gallery");
      }

      const { data, error } = await supabase
        .from("gallery_images")
        .update({
          image_url: imageUrl,
          caption: caption || null,
          status: status || "published",
          sort_order: sortOrder || 0
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create image
      const { data, error } = await supabase
        .from("gallery_images")
        .insert({
          image_url: imageUrl,
          caption: caption || null,
          status: status || "published",
          sort_order: sortOrder || 0
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, image: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save image" }, { status: 500 });
  }
}

// DELETE /api/admin/content/gallery - Delete record and its file
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing image ID parameter" }, { status: 400 });
    }

    // Select the slide image URL
    const { data: img } = await supabase
      .from("gallery_images")
      .select("image_url")
      .eq("id", id)
      .single();

    if (img?.image_url) {
      await cleanStorageAsset(img.image_url, "gallery");
    }

    // Delete record
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete image" }, { status: 500 });
  }
}
