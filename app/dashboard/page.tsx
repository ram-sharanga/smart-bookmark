import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchBookmarks } from "@/app/actions/bookmarks";
import { BookmarkList } from "@/components/BookmarkList";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: bookmarks, error } = await fetchBookmarks();
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Subtle background blobs — same as login, but very faint */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full opacity-10 dark:opacity-5"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-10 dark:opacity-5"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <DashboardHeader
          email={user.email ?? ""}
          avatarUrl={avatarUrl}
          bookmarkCount={bookmarks?.length ?? 0}
        />
        <main className="max-w-2xl mx-auto px-4 py-6">
          {error ? (
            <div className="rounded-[var(--radius)] p-4 text-sm"
              style={{
                background: "var(--danger-light)",
                border: "1px solid var(--danger)",
                color: "var(--danger)",
              }}>
              Failed to load: {error}
            </div>
          ) : (
            <BookmarkList
              initialBookmarks={bookmarks ?? []}
              userId={user.id}
            />
          )}
        </main>
      </div>
    </div>
  );
}