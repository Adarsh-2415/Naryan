import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Add generic loader to fetch global settings and cache them
export async function getGlobalSettings() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from("global_settings").select("*").limit(1);
    return data?.[0] || null;
  } catch (err) {
    console.error("Failed to load global settings:", err);
    return null;
  }
}
