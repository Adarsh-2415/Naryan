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

// GET /api/admin/content/treatments
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: treatments, error } = await supabase
      .from("treatments")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, treatments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load treatments" }, { status: 500 });
  }
}

// POST /api/admin/content/treatments
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { 
      id, 
      title, 
      slug, 
      shortDescription, 
      fullContent, 
      imageUrl, 
      status, 
      displayOrder, 
      featured, 
      seoTitle, 
      seoDescription 
    } = body;

    if (!title || !shortDescription || !fullContent) {
      return NextResponse.json({ error: "Title, short description, and full content are required" }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    let result;
    if (id) {
      // Update treatment
      const { data: oldTreatment } = await supabase
        .from("treatments")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldTreatment && oldTreatment.image_url && oldTreatment.image_url !== imageUrl) {
        await cleanStorageAsset(oldTreatment.image_url, "treatments");
      }

      const { data, error } = await supabase
        .from("treatments")
        .update({
          title,
          slug: generatedSlug,
          short_description: shortDescription,
          full_content: fullContent,
          image_url: imageUrl || null,
          status: status || "published",
          display_order: displayOrder || 0,
          featured: featured || false,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create treatment
      const { data, error } = await supabase
        .from("treatments")
        .insert({
          title,
          slug: generatedSlug,
          short_description: shortDescription,
          full_content: fullContent,
          image_url: imageUrl || null,
          status: status || "published",
          display_order: displayOrder || 0,
          featured: featured || false,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, treatment: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save treatment" }, { status: 500 });
  }
}

// DELETE /api/admin/content/treatments
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing treatment ID parameter" }, { status: 400 });
    }

    const { data: t } = await supabase
      .from("treatments")
      .select("image_url")
      .eq("id", id)
      .single();

    if (t?.image_url) {
      await cleanStorageAsset(t.image_url, "treatments");
    }

    const { error } = await supabase.from("treatments").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete treatment" }, { status: 500 });
  }
}
