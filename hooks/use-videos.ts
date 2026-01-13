"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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

// List videos
export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json() as Promise<Video[]>;
    },
  });
}

// Upload flow hook
export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      description,
      creatorId,
    }: {
      file: File;
      description: string;
      creatorId: string;
    }) => {
      // 1. Get Signed URL
      const uploadRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!uploadRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, publicUrl } = await uploadRes.json();

      // 2. Upload to Supabase Storage
      const storageRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!storageRes.ok) throw new Error("Failed to upload file to storage");

      // 3. Get video duration
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";

      const duration = await new Promise<number>((resolve) => {
        videoEl.onloadedmetadata = () => {
          URL.revokeObjectURL(videoEl.src);
          resolve(Math.round(videoEl.duration));
        };
        videoEl.src = URL.createObjectURL(file);
      });

      // 4. Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      // 5. Create Video Record
      const createRes = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          creator_id: creatorId,
          video_url: publicUrl,
          description,
          duration,
          aspect_ratio: "9:16",
        }),
      });

      if (!createRes.ok) throw new Error("Failed to save video metadata");
      return createRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
