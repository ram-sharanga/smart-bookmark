"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
      style={{
        background: hover ? "var(--bg-subtle)" : "transparent",
        color: hover ? "var(--danger)" : "var(--text-3)",
        border: "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {loading ? "…" : "Sign out"}
    </button>
  );
}
