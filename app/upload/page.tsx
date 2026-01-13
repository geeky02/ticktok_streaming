"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUploadVideo } from "@/hooks/use-videos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadVideo, isPending } = useUploadVideo();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect if auth check is complete and user is not authenticated
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video under 50MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      await uploadVideo({
        file,
        description,
        creatorId: user.id,
      });

      toast({
        title: "Success!",
        description: "Your video has been uploaded.",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated (handled by useEffect, but show nothing while redirecting)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="pt-4">
          <h1 className="text-3xl font-display font-bold">New Post</h1>
          <p className="text-muted-foreground mt-1">Share your moment with the world</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Video Upload Area - Left Side */}
          <div
            className={`
              relative aspect-[4/3] w-full md:w-1/2 max-w-md rounded-2xl overflow-hidden border-2 border-dashed
              flex flex-col items-center justify-center transition-all cursor-pointer
              ${previewUrl ? 'border-transparent bg-black' : 'border-white/10 bg-secondary/20 hover:bg-secondary/30'}
            `}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <>
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover opacity-80"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-4 right-4 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Select Video</h3>
                <p className="text-sm text-muted-foreground">MP4 or MOV, up to 50MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Caption and Button - Right Side, Side by Side */}
          <div className="flex-1 w-full md:w-1/2 flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium ml-1">Caption</label>
              <Input
                placeholder="Write a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/30 border-white/5"
              />
            </div>

            <Button
              className="w-full md:w-auto px-8 py-6 text-lg rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 whitespace-nowrap"
              disabled={!file || isPending}
              onClick={handleUpload}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Post Video"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
