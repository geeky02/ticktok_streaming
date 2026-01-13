"use client"

import { useVideos } from "@/hooks/use-videos";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

function FeedItem({ video }: { video: any }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <div ref={ref} className="h-full w-full snap-center">
      <VideoPlayer video={video} isActive={inView} />
    </div>
  );
}

export default function Feed() {
  const { data: videos, isLoading, error } = useVideos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white p-6 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load feed. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white p-6 text-center">
        <div>
          <h2 className="text-2xl font-display font-bold mb-2">No Videos Yet</h2>
          <p className="text-muted-foreground">Be the first to upload something amazing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-y-scroll snap-y-mandatory no-scrollbar bg-black">
      {videos.map((video) => (
        <FeedItem key={video.id} video={video} />
      ))}
    </div>
  );
}
