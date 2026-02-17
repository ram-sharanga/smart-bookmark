import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
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
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle,var(--accent-s),transparent 70%)",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      <div className="w-full max-w-85 relative z-10">
        <div className="inline-flex items-center gap-2.5 mb-7">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: "var(--accent)",
              boxShadow: "0 2px 8px var(--accent-s)",
            }}
          >
            🔖
          </div>
          <span
            className="text-[28px]"
            style={{
              fontFamily: "'Instrument Serif',serif",
              color: "var(--text-1)",
              letterSpacing: "-0.02em",
            }}
          >
            Book
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>
              mark.
            </span>
          </span>
        </div>

        <h1
          className="text-[34px] leading-tight mb-2"
          style={{
            fontFamily: "'Instrument Serif',serif",
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
          }}
        >
          Your links,
          <br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            beautifully
          </em>{" "}
          kept.
        </h1>

        <p
          className="text-sm mb-8"
          style={{ color: "var(--text-2)", lineHeight: 1.5 }}
        >
          Private bookmarks. Real-time sync across every tab and device.
        </p>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
