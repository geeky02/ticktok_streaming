import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, createAuthenticatedClient } from "@/lib/supabase-server";

export interface Video {
  id: string;
  creator_id: string;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  aspect_ratio: string | null;
  duration: number | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let query = supabaseServer
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creator_id, video_url, thumbnail_url, description, aspect_ratio, duration } = body;

    if (!creator_id || !video_url) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get auth token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    // Use authenticated client if token is provided, otherwise use server client (with service role key)
    const client = accessToken
      ? createAuthenticatedClient(accessToken)
      : supabaseServer;

    const { data, error } = await client
      .from("videos")
      .insert({
        creator_id: creator_id,
        video_url: video_url,
        thumbnail_url: thumbnail_url || null,
        description: description || null,
        aspect_ratio: aspect_ratio || null,
        duration: duration || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
