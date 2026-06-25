import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing asset URL parameter" }, { status: 400 });
    }

    // Parse the bucket and unique filename from the Supabase storage URL structure:
    // https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/storage/v1/object/public/");
    
    if (pathParts.length < 2) {
      return NextResponse.json({ error: "Invalid Supabase storage URL format" }, { status: 400 });
    }

    const restOfPath = pathParts[1];
    const firstSlash = restOfPath.indexOf("/");
    const bucket = restOfPath.substring(0, firstSlash);
    const fileName = restOfPath.substring(firstSlash + 1);

    if (!bucket || !fileName) {
      return NextResponse.json({ error: "Could not parse bucket or filename" }, { status: 400 });
    }

    // Remove from storage bucket
    const { data, error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Asset deletion exception:", error);
    return NextResponse.json({ error: error.message || "Failed to delete storage asset" }, { status: 500 });
  }
}
