import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchBookmarks } from "@/app/actions/bookmarks";
import { BookmarkList } from "@/components/BookmarkList";
import { DashboardHeader } from "@/components/DashboardHeader";

const DashboardHero = () => (
  <div className="select-none">
    <h1
      className="text-[60px] font-medium tracking-tight leading-none text-(--text-1) font-serif"
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontWeight: 500,
      }}
    >
      Your collection
      <span className="text-(--accent)">.</span>
    </h1>
    <p className="text-sm" style={{ color: "var(--text-3)" }}>
      Everything you&apos;ve saved, always in sync.
    </p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div
    className="rounded-2xl p-4 mt-6 text-sm border"
    style={{
      background: "var(--accent-l)",
      borderColor: "var(--accent-s)",
      color: "var(--accent)",
    }}
  >
    Failed to load: {message}
  </div>
);

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: bookmarks, error } = await fetchBookmarks();

  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div className="min-h-screen flex flex-col gap-4 bg-(--bg)">
      <DashboardHeader email={user.email ?? ""} avatarUrl={avatarUrl} />

      <main className="mx-auto w-full px-4 max-w-160 pb-20 flex flex-col gap-4">
        <DashboardHero />

        {error ? (
          <ErrorState message={error} />
        ) : (
          <BookmarkList initialBookmarks={bookmarks ?? []} userId={user.id} />
        )}
      </main>
    </div>
  );
}
