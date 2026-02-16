import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Subtle top grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="w-full max-w-[400px] relative">

        {/* Wordmark */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "var(--accent)", boxShadow: "0 4px 16px var(--accent-shadow)" }}
            >
              🔖
            </div>
          </div>
          <h1
            className="text-5xl leading-[1.1] tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Your links,<br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>beautifully</em> kept.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Private bookmarks. Real-time sync. Nothing else.
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Continue with
          </p>
          <LoginButton />
          <div
            className="mt-5 pt-5 text-center text-xs leading-relaxed"
            style={{
              borderTop: "1px solid var(--divider)",
              color: "var(--text-tertiary)",
            }}
          >
            No password needed. Sign in once, stay forever.
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>
          Private by default — only you see your bookmarks.
        </p>
      </div>
    </main>
  );
}