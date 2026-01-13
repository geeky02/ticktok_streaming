"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PlusSquare, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  if (pathname === "/auth") return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        <Link href="/" className={cn(
          "flex flex-col items-center gap-1 p-2 transition-colors",
          pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-white"
        )}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Feed</span>
        </Link>

        {user ? (
          <>
            <Link href="/upload" className="flex items-center justify-center -mt-8">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25",
                pathname === "/upload"
                  ? "bg-primary text-white"
                  : "bg-gradient-to-tr from-primary to-accent text-white"
              )}>
                <PlusSquare className="w-7 h-7" />
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-white transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          </>
        ) : (
          <Link href="/auth" className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            pathname === "/auth" ? "text-primary" : "text-muted-foreground hover:text-white"
          )}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
