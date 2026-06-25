import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CONST_ID = "00000000-0000-0000-0000-000000000000";

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

// GET /api/admin/content/about
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("about_page_config")
      .select("*")
      .eq("id", CONST_ID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Return baseline defaults if database hasn't been seeded yet
      return NextResponse.json({
        success: true,
        config: {
          id: CONST_ID,
          hero_title: "Empowering Your Health Naturally",
          hero_subtitle: "Constitutional homeopathy consultations customized for your unique lifestyle and wellness goals.",
          hero_image_url: "",
          story_content: "At Narayan Homoeopathic Chikitsalaya, we believe in restoring balance. Our clinic has served the Roorkee community for over 15 years, integrating traditional homeopathy values with modern diagnostics.",
          show_mission_vision: true,
          mission_text: "To offer constitutional healing that restores complete health gently and safely.",
          vision_text: "To make gentle constitutional homoeopathic care accessible to every household in Roorkee.",
          show_clinic_stats: true,
          stats_years_count: "15+",
          stats_patients_count: "10k+",
          stats_satisfaction_rate: "99%",
          show_values_grid: true,
          value_card1_title: "Constitutional Approach",
          value_card1_desc: "Tailored to your genetic and behavioral blueprint.",
          value_card2_title: "Gentle & Non-Toxic",
          value_card2_desc: "Safe constitutional remedies with zero side effects.",
          value_card3_title: "Experienced Doctors",
          value_card3_desc: "Consultation under certified homeopathic medical experts.",
          value_card4_title: "Comprehensive Wellness",
          value_card4_desc: "Improving overall vitality and physiological resilience."
        }
      });
    }

    return NextResponse.json({ success: true, config: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load about config" }, { status: 500 });
  }
}

// POST /api/admin/content/about - Upsert config row
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const {
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      storyContent,
      showMissionVision,
      missionText,
      visionText,
      showClinicStats,
      statsYearsCount,
      statsPatientsCount,
      statsSatisfactionRate,
      showValuesGrid,
      valueCard1Title,
      valueCard1Desc,
      valueCard2Title,
      valueCard2Desc,
      valueCard3Title,
      valueCard3Desc,
      valueCard4Title,
      valueCard4Desc
    } = body;

    if (!heroTitle || !storyContent) {
      return NextResponse.json({ error: "Hero title and Story content copy are required" }, { status: 400 });
    }

    // Clean old image if replaced
    const { data: oldConfig } = await supabase
      .from("about_page_config")
      .select("hero_image_url")
      .eq("id", CONST_ID)
      .maybeSingle();

    if (oldConfig && oldConfig.hero_image_url && oldConfig.hero_image_url !== heroImageUrl) {
      await cleanStorageAsset(oldConfig.hero_image_url, "about");
    }

    const { data, error } = await supabase
      .from("about_page_config")
      .upsert({
        id: CONST_ID,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle || null,
        hero_image_url: heroImageUrl || null,
        story_content: storyContent,
        show_mission_vision: showMissionVision || false,
        mission_text: missionText || null,
        vision_text: visionText || null,
        show_clinic_stats: showClinicStats || false,
        stats_years_count: statsYearsCount || "15+",
        stats_patients_count: statsPatientsCount || "10k+",
        stats_satisfaction_rate: statsSatisfactionRate || "99%",
        show_values_grid: showValuesGrid || false,
        value_card1_title: valueCard1Title,
        value_card1_desc: valueCard1Desc,
        value_card2_title: valueCard2Title,
        value_card2_desc: valueCard2Desc,
        value_card3_title: valueCard3Title,
        value_card3_desc: valueCard3Desc,
        value_card4_title: valueCard4Title,
        value_card4_desc: valueCard4Desc,
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, config: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save about config" }, { status: 500 });
  }
}
