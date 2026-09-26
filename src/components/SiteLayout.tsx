import { Link } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-studio-gradient">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <AudioLines className="size-5 text-primary" />
            VoxMorph
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Voice changer
            </Link>
            <Link to="/voice-effects" className="transition-colors hover:text-foreground">
              Effects
            </Link>
            <Link to="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border/60 bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VoxMorph — free online voice changer.</p>
          <p>Audio is processed in your browser and never uploaded.</p>
        </div>
      </footer>
    </div>
  );
}
