import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export default function AuthErrorPage() {
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
          background:
            "radial-gradient(circle, var(--accent-s), transparent 70%)",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-s), transparent 70%)",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      <div className="w-full max-w-85 relative z-10">
        <div className="mb-7">
          <Logo />
        </div>

        <div className="space-y-2 mb-8">
          <h1
            className="text-[34px] leading-tight font-serif font-bold tracking-tight"
            style={{
              color: "var(--text-1)",
              fontFamily: "'Instrument Serif', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Auth{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              interrupted.
            </em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-3)", lineHeight: 1.5 }}
          >
            The sign-in link might have expired or the connection was
            interrupted. Let&apos;s try that again.
          </p>
        </div>

        {/* Action Container */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <Link
            href="/"
            className="inline-block w-full py-3 rounded-xl font-bold text-sm transition-all hover:brightness-105 active:scale-[0.98] border border-black/5 dark:border-white/10 text-center"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              boxShadow: "0 4px 12px var(--accent-s)",
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
