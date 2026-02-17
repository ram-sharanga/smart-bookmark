import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Subtle blobs */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle, var(--accent-shadow) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, var(--accent-shadow) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-[340px] relative z-10">
        {/* Wordmark */}
        <div className="inline-flex items-center gap-2.5 mb-7">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: "var(--accent)",
              boxShadow: "0 2px 8px var(--accent-shadow)",
            }}
          >
            🔖
          </div>
          <span
            className="text-[28px] tracking-tight"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            Book<span style={{ color: "var(--accent)", fontStyle: "italic" }}>mark.</span>
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[34px] leading-[1.1] tracking-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            color: "var(--text-primary)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Your links,<br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>beautifully</em> kept.
        </h1>

        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>
          Private bookmarks. Real-time sync across every tab and device.
        </p>

        {/* Card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <LoginButton />
          <div
            className="mt-3.5 pt-3.5 text-center text-xs"
            style={{
              borderTop: "1px solid var(--divider)",
              color: "var(--text-tertiary)",
              lineHeight: "1.5",
            }}
          >
            No password. Google OAuth only.
          </div>
        </div>
      </div>
    </main>
  );
}