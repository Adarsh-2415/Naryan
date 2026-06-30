import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null; // e.g. 'gallery', 'awards'

    if (!file || !folder) {
      return NextResponse.json({ error: "Missing file or folder parameter" }, { status: 400 });
    }

    // 1. File validation
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid image format. Supported formats: PNG, JPEG, JPG, WebP" }, { status: 400 });
    }

    const maxBytes = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File exceeds maximum size threshold of 5MB" }, { status: 400 });
    }

    // 2. Generate clean custom filename
    const fileExtension = file.type.split("/")[1] || "webp";
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const uuid = crypto.randomUUID();
    const cleanFilename = `${folder}-${dateStr}-${uuid}.${fileExtension}`;
    const storagePath = `${folder}/${cleanFilename}`;

    // 3. Upload raw binary to Supabase bucket
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseClient.storage
      .from("cms-media")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: `Upload error: ${uploadError.message}` }, { status: 500 });
    }

    // 4. Retrieve public image URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from("cms-media")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      image_url: publicUrl,
      storage_path: storagePath
    });

  } catch (err: any) {
    console.error("Upload route exception:", err);
    return NextResponse.json({ error: err.message || "Failed to process upload" }, { status: 500 });
  }
}
