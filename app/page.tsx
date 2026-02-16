import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // If user is already logged in, skip the login page
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-3xl shadow-md">
            🔖
          </div>
          <div className="text-center">
            <h1 className="font-head text-4xl font-extrabold text-foreground">
              Bookmark<span className="text-accent">.</span>
            </h1>
            <p className="text-muted text-sm mt-2 max-w-[220px] mx-auto leading-relaxed">
              Your private collection — always in sync, everywhere you go.
            </p>
          </div>
        </div>

        {/* Sign in card */}
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-[var(--shadow-md)] space-y-4">
          <LoginButton />
          <p className="text-center text-xs text-muted">
            Google sign-in only — no passwords needed.
          </p>
        </div>
      </div>
    </main>
  );
}