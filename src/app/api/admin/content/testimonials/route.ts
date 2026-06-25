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

// GET /api/admin/content/testimonials
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load testimonials" }, { status: 500 });
  }
}

// POST /api/admin/content/testimonials - Create or Update testimonial
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { 
      id, 
      patientName, 
      treatmentReceived, 
      testimonialText, 
      rating, 
      patientImageUrl, 
      displayOrder, 
      featured, 
      status 
    } = body;

    if (!patientName || !testimonialText) {
      return NextResponse.json({ error: "Patient name and testimonial text are required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update testimonial - if patientImageUrl changed, clean old one
      const { data: oldTestimonial } = await supabase
        .from("testimonials")
        .select("patient_image_url")
        .eq("id", id)
        .single();

      if (oldTestimonial && oldTestimonial.patient_image_url && oldTestimonial.patient_image_url !== patientImageUrl) {
        await cleanStorageAsset(oldTestimonial.patient_image_url, "testimonials");
      }

      const { data, error } = await supabase
        .from("testimonials")
        .update({
          patient_name: patientName,
          treatment_received: treatmentReceived || null,
          testimonial_text: testimonialText,
          rating: rating || 5,
          patient_image_url: patientImageUrl || null,
          display_order: displayOrder || 0,
          featured: featured || false,
          status: status || "published"
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create testimonial
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          patient_name: patientName,
          treatment_received: treatmentReceived || null,
          testimonial_text: testimonialText,
          rating: rating || 5,
          patient_image_url: patientImageUrl || null,
          display_order: displayOrder || 0,
          featured: featured || false,
          status: status || "published"
        })
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, testimonial: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save testimonial" }, { status: 500 });
  }
}

// DELETE /api/admin/content/testimonials - Delete record and its file
export async function DELETE(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID parameter" }, { status: 400 });
    }

    // Select the testimonial avatar image URL
    const { data: testimonial } = await supabase
      .from("testimonials")
      .select("patient_image_url")
      .eq("id", id)
      .single();

    if (testimonial?.patient_image_url) {
      await cleanStorageAsset(testimonial.patient_image_url, "testimonials");
    }

    // Delete record
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
