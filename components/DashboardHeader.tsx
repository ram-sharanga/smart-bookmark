"use client";

import { useTheme } from "next-themes";
import { SignOutButton } from "./SignOutButton";
import { useSyncExternalStore } from "react";

type Props = {
  email: string;
  avatarUrl?: string | null;
  bookmarkCount: number;
};

// Proper hydration-safe mount check — no setState in effect
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function DashboardHeader({ email, avatarUrl, bookmarkCount }: Props) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <header
      className="sticky top-0 z-30 w-full"
      style={{
        background: "var(--surface)",
        backdropFilter: "var(--blur)",
        WebkitBackdropFilter: "var(--blur)",
        borderBottom: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[var(--radius-xs)] flex items-center justify-center text-lg shrink-0"
            style={{
              background: "var(--accent)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
            }}
          >
            🔖
          </div>
          <span
            className="font-[family-name:var(--font-head)] text-lg font-black tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Book<span style={{ color: "var(--accent)" }}>mark.</span>
          </span>
          {/* Live dot */}
          <div className="flex items-center gap-1 ml-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
              style={{ background: "var(--success)" }}
            />
            <span
              className="text-xs hidden sm:block"
              style={{ color: "var(--text-secondary)" }}
            >
              live
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Bookmark count */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:block"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            {bookmarkCount} saved
          </span>

          {/* Theme toggle — only renders after hydration */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xs)] transition-all duration-200 text-base"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {/* Avatar */}
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={email}
              className="w-8 h-8 rounded-full shrink-0"
              style={{ border: "2px solid var(--border)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "var(--accent)" }}
            >
              {email.charAt(0).toUpperCase()}
            </div>
          )}

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
