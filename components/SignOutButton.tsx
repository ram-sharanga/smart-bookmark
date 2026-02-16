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
      className="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-xs)] transition-all duration-200 disabled:opacity-50"
      style={{
        color: "var(--text-secondary)",
        background: "var(--surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {loading ? "…" : "Sign out"}
    </button>
  );
}