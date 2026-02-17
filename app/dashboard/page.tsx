import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchBookmarks } from "@/app/actions/bookmarks";
import { BookmarkList } from "@/components/BookmarkList";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: bookmarks, error } = await fetchBookmarks();
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <DashboardHeader
        email={user.email ?? ""}
        avatarUrl={avatarUrl}
        bookmarkCount={bookmarks?.length ?? 0}
      />
      <main className="max-w-2xl mx-auto px-5 py-7">
        {/* Page heading */}
        <div className="mb-6">
          <h1
            className="text-[30px] mb-1 leading-tight"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 500,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Your collection<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Everything you&apos;ve saved, always in sync.
          </p>
        </div>

        {error ? (
          <div
            className="rounded-2xl p-4 text-sm"
            style={{
              background: "var(--accent-light)",
              border: "1px solid var(--accent-shadow)",
              color: "var(--accent)",
            }}
          >
            Failed to load bookmarks: {error}
          </div>
        ) : (
          <BookmarkList initialBookmarks={bookmarks ?? []} userId={user.id} />
        )}
      </main>
    </div>
  );
}