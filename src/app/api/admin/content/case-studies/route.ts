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

// GET /api/admin/content/case-studies
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: cases, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, caseStudies: cases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load case studies" }, { status: 500 });
  }
}

// POST /api/admin/content/case-studies
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
      summary, 
      content, 
      category, 
      imageUrl, 
      status, 
      displayOrder, 
      featured, 
      seoTitle, 
      seoDescription 
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content copy are required" }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    let result;
    if (id) {
      // Update case study
      const { data: oldCase } = await supabase
        .from("case_studies")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldCase && oldCase.image_url && oldCase.image_url !== imageUrl) {
        await cleanStorageAsset(oldCase.image_url, "case-studies");
      }

      const { data, error } = await supabase
        .from("case_studies")
        .update({
          title,
          slug: generatedSlug,
          summary: summary || null,
          content,
          category: category || null,
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
      // Create case study
      const { data, error } = await supabase
        .from("case_studies")
        .insert({
          title,
          slug: generatedSlug,
          summary: summary || null,
          content,
          category: category || null,
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

    return NextResponse.json({ success: true, caseStudy: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save case study" }, { status: 500 });
  }
}

// DELETE /api/admin/content/case-studies
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing case study ID parameter" }, { status: 400 });
    }

    const { data: c } = await supabase
      .from("case_studies")
      .select("image_url")
      .eq("id", id)
      .single();

    if (c?.image_url) {
      await cleanStorageAsset(c.image_url, "case-studies");
    }

    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete case study" }, { status: 500 });
  }
}
