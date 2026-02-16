import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <p className="text-foreground font-head text-2xl font-bold">
        Dashboard — coming in Group C
      </p>
      <p className="text-muted text-sm mt-2">
        Logged in as: {user.email}
      </p>
    </main>
  );
}