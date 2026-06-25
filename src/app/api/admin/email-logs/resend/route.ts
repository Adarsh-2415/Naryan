import { NextRequest, NextResponse } from "next/server";
import { resendEmailLog } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing log ID parameter" }, { status: 400 });
    }

    const result = await resendEmailLog(id);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Resend Email Exception:", error);
    return NextResponse.json({ error: error.message || "Failed to resend email" }, { status: 500 });
  }
}
