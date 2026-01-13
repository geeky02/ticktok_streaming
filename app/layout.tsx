import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Vertical Reels - TikTok Clone",
  description: "A TikTok-like vertical video feed application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {children}
            <Navbar />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
