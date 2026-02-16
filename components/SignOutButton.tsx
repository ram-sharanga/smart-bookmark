"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
      style={{
        background: "transparent",
        color: "var(--text-tertiary)",
        fontFamily: "var(--font-body)",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.color = "var(--danger)";
        (e.target as HTMLButtonElement).style.background = "var(--bg-subtle)";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.color = "var(--text-tertiary)";
        (e.target as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {loading ? "…" : "Sign out"}
    </button>
  );
}