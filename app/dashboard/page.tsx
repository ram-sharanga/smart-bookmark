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

  if (!user) {
    redirect("/");
  }

  const { data: bookmarks, error } = await fetchBookmarks();

  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        email={user.email ?? ""}
        avatarUrl={avatarUrl}
      />
      <main className="max-w-3xl mx-auto px-4 py-6">
        {error ? (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-sm font-body">
            Failed to load bookmarks: {error}
          </div>
        ) : (
          <BookmarkList
            initialBookmarks={bookmarks ?? []}
            userId={user.id}
          />
        )}
      </main>
    </div>
  );
}