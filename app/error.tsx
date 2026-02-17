"use client";

import { useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle,var(--accent-s),transparent 70%)",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      <div className="w-full max-w-85 relative z-10">
        <div className="inline-flex items-center gap-2.5 mb-7 select-none">
          <Logo />
        </div>

        <h1
          className="text-[34px] leading-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
          }}
        >
          Something
          <br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            interrupted
          </em>{" "}
          the flow.
        </h1>

        <p className="text-sm mb-8" style={{ color: "var(--text-2)", lineHeight: 1.5 }}>
          {error.message || "An unexpected error occurred."}
        </p>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:brightness-105 active:scale-[0.98] border border-black/5 dark:border-white/10"
            style={{ 
              background: "var(--accent)", 
              color: "var(--bg)",
              boxShadow: "0 4px 12px var(--accent-s)"
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}