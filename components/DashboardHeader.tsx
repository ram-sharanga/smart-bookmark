"use client";

import { useTheme } from "next-themes";
import { SignOutButton } from "./SignOutButton";
import { useSyncExternalStore } from "react";

type Props = {
  email: string;
  avatarUrl?: string | null;
  bookmarkCount: number;
};

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function DashboardHeader({ email, avatarUrl, bookmarkCount }: Props) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="max-w-2xl mx-auto px-5 flex items-center justify-between gap-3"
        style={{ height: "52px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: "var(--accent)",
              boxShadow: "0 2px 8px var(--accent-shadow)",
            }}
          >
            🔖
          </div>
          <span
            className="text-lg tracking-tight"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Book<span style={{ color: "var(--accent)", fontStyle: "italic" }}>mark.</span>
          </span>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 ml-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
              style={{ background: "var(--success)" }}
            />
            <span className="text-[11px] hidden sm:block" style={{ color: "var(--text-tertiary)" }}>
              live
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Count */}
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full hidden sm:block"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent)",
            }}
          >
            {bookmarkCount} {bookmarkCount === 1 ? "link" : "links"}
          </span>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--divider)",
                color: "var(--text-tertiary)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "var(--divider)";
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
              alt=""
              className="w-7 h-7 rounded-full"
              style={{ border: "1.5px solid var(--divider)" }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
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