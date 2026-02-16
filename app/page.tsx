import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 dark:opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 dark:opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 60%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Hero text */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
            style={{ background: "var(--accent)", boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }}>
            <span className="text-3xl">🔖</span>
          </div>
          <h1 className="font-[family-name:var(--font-head)] text-5xl font-black tracking-tight"
            style={{ color: "var(--text)" }}>
            Book<span style={{ color: "var(--accent)" }}>mark</span>
            <span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p className="text-base font-light leading-relaxed max-w-[260px] mx-auto"
            style={{ color: "var(--text-secondary)" }}>
            Private. Instant. Always in sync.
          </p>
        </div>

        {/* Glass card */}
        <div className="glass w-full rounded-[var(--radius)] p-6 space-y-4">
          <p className="text-sm font-medium text-center" style={{ color: "var(--text-secondary)" }}>
            Sign in to your collection
          </p>
          <LoginButton />
          <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
            Google OAuth only — no passwords, ever.
          </p>
        </div>
      </div>
    </main>
  );
}