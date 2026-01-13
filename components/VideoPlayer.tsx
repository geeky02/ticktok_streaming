"use client"

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Heart, MessageCircle, Share2, Music2, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/hooks/use-videos";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
}

export function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.6,
  });

  useEffect(() => {
    if (isActive && inView) {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, inView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play/pause
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-[100dvh] bg-black snap-center overflow-hidden flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={video.video_url}
        className="h-full w-auto max-w-full"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-10">
        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="glass" className="rounded-full w-12 h-12">
            <Heart className="w-6 h-6 fill-white/10" />
          </Button>
          <span className="text-xs font-semibold shadow-black drop-shadow-md">1.2K</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="glass" className="rounded-full w-12 h-12">
            <MessageCircle className="w-6 h-6" />
          </Button>
          <span className="text-xs font-semibold shadow-black drop-shadow-md">342</span>
        </div>

        <Button size="icon" variant="glass" className="rounded-full w-12 h-12">
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Mute/Unmute Button */}
      <div className="absolute bottom-24 left-4 z-10">
        <Button
          size="icon"
          variant="glass"
          className="rounded-full w-12 h-12"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-[80%] space-y-2">
          <h3 className="text-lg font-bold font-display shadow-black drop-shadow-md">@{video.creator_id}</h3>
          <p className="text-sm text-white/90 font-medium line-clamp-2 shadow-black drop-shadow-md">
            {video.description || "No description"}
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-white/80">
            <Music2 className="w-3 h-3 animate-spin" />
            <span>Original Audio - {video.creator_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
