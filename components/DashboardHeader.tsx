"use client";

import { useTheme } from "next-themes";
import { SignOutButton } from "./SignOutButton";
import { useEffect, useState } from "react";

type Props = {
  email: string;
  avatarUrl?: string | null;
};

export function DashboardHeader({ email, avatarUrl }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render theme toggle after mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const initials = email.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-card-border shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🔖</span>
          <span className="font-head font-extrabold text-lg text-foreground">
            Bookmark<span className="text-accent">.</span>
          </span>
          {/* Realtime indicator */}
          <span className="flex items-center gap-1 text-xs text-muted ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
            live
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-input-bg transition-all text-base"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={email}
                className="w-7 h-7 rounded-full border border-card-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold font-head">
                {initials}
              </div>
            )}
            <span className="text-xs text-muted font-body hidden sm:block truncate max-w-[140px]">
              {email}
            </span>
          </div>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
