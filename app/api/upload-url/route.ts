import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { message: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    const fileExt = filename.split(".").pop();
    const uniquePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Create a signed URL for uploading
    const { data: signedData, error: signedError } = await supabaseServer.storage
      .from("videos")
      .createSignedUploadUrl(uniquePath);

    if (signedError) throw signedError;

    // Get public URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from("videos")
      .getPublicUrl(uniquePath);

    return NextResponse.json({
      uploadUrl: signedData.signedUrl,
      publicUrl,
      path: uniquePath,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
