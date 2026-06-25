import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const SEO_CONST_ID = "11111111-1111-1111-1111-111111111111";

// GET /api/admin/seo
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("global_seo_config")
      .select("*")
      .eq("id", SEO_CONST_ID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Default configurations fallback
      return NextResponse.json({
        success: true,
        config: {
          id: SEO_CONST_ID,
          site_name: "Narayan Homoeopathic Chikitsalaya",
          meta_title: "Narayan Homoeopathic Chikitsalaya | Constitutional Homeopathy Roorkee",
          meta_description: "Schedule professional constitutional homeopathy consultations at Narayan Clinic Roorkee. Safe, natural remedies tailored to your health profile.",
          og_image_url: "",
          clinic_phone: "+91-1332 270021",
          clinic_email: "homoeopathy4u@gmail.com",
          clinic_address: "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667",
          google_maps_url: "https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee",
          facebook_url: "",
          instagram_url: "",
          youtube_url: "",
          linkedin_url: "",
          google_analytics_id: "",
          google_tag_manager_id: "",
          google_search_console_verification: ""
        }
      });
    }

    return NextResponse.json({ success: true, config: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load seo configuration" }, { status: 500 });
  }
}

// POST /api/admin/seo - Upsert settings row
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const {
      siteName,
      metaTitle,
      metaDescription,
      ogImageUrl,
      clinicPhone,
      clinicEmail,
      clinicAddress,
      googleMapsUrl,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      googleAnalyticsId,
      googleTagManagerId,
      googleSearchConsoleVerification
    } = body;

    if (!metaTitle || !metaDescription) {
      return NextResponse.json({ error: "Meta title and description are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("global_seo_config")
      .upsert({
        id: SEO_CONST_ID,
        site_name: siteName || "Narayan Homoeopathic Chikitsalaya",
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_image_url: ogImageUrl || null,
        clinic_phone: clinicPhone,
        clinic_email: clinicEmail,
        clinic_address: clinicAddress,
        google_maps_url: googleMapsUrl,
        facebook_url: facebookUrl || null,
        instagram_url: instagramUrl || null,
        youtube_url: youtubeUrl || null,
        linkedin_url: linkedinUrl || null,
        google_analytics_id: googleAnalyticsId || null,
        google_tag_manager_id: googleTagManagerId || null,
        google_search_console_verification: googleSearchConsoleVerification || null,
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, config: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save configuration" }, { status: 500 });
  }
}
