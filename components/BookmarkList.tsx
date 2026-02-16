"use client";

import { useState, useCallback, useMemo } from "react";
import type { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./BookmarkCard";
import { useRealtimeBookmarks } from "@/hooks/useRealtimeBookmarks";
import { ToastContainer, useToast } from "./Toast";
import { AddBookmarkModal } from "./AddBookmarkModal";

type Props = {
  initialBookmarks: Bookmark[];
  userId: string;
};

export function BookmarkList({ initialBookmarks, userId }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "alpha">("newest");
  const { toasts, addToast, removeToast } = useToast();

  // Realtime: insert handler
  const handleRealtimeInsert = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      // Avoid duplicates (in case the inserting tab also updates state)
      if (prev.find((b) => b.id === bookmark.id)) return prev;
      addToast("New bookmark synced from another tab!", "info");
      return [bookmark, ...prev];
    });
  }, []);

  // Realtime: delete handler
  const handleRealtimeDelete = useCallback((id: string) => {
    setBookmarks((prev) => {
      if (!prev.find((b) => b.id === id)) return prev;
      return prev.filter((b) => b.id !== id);
    });
  }, []);

  useRealtimeBookmarks({
    userId,
    onInsert: handleRealtimeInsert,
    onDelete: handleRealtimeDelete,
  });

  // Optimistic delete (instant UI, no waiting for server)
  function handleDelete(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    addToast("Bookmark deleted.", "success");
  }

  // Get all unique tags across bookmarks for the filter bar
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result = [...bookmarks];

    if (activeTag) {
      result = result.filter((b) => b.tags.includes(activeTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }

    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOrder === "alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [bookmarks, activeTag, search, sortOrder]);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(msg) => {
          addToast(msg, "success");
          // Note: Realtime will push the new bookmark to state,
          // so we don't need to manually update here
        }}
        onError={(msg) => addToast(msg, "error")}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, URL, or tag…"
            className="w-full bg-card border border-card-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "newest" | "oldest" | "alpha")
          }
          className="bg-card border border-card-border rounded-xl px-3 py-2.5 text-sm text-foreground font-body focus:outline-none focus:border-accent transition-all cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alpha">A → Z</option>
        </select>

        {/* Add button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white rounded-xl px-5 py-2.5 text-sm font-head font-bold transition-all whitespace-nowrap flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span>
          Add Bookmark
        </button>
      </div>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
              activeTag === null
                ? "bg-accent text-white"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                activeTag === tag
                  ? "bg-accent text-white"
                  : "bg-card border border-card-border text-muted hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted mb-3 font-body">
        {filtered.length === bookmarks.length
          ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${bookmarks.length} bookmarks`}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          hasBookmarks={bookmarks.length > 0}
          onAdd={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
              onError={(msg) => addToast(msg, "error")}
            />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({
  hasBookmarks,
  onAdd,
}: {
  hasBookmarks: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="text-5xl">
        {hasBookmarks ? "🔍" : "🔖"}
      </div>
      <div>
        <p className="font-head font-bold text-lg text-foreground">
          {hasBookmarks ? "No matches found" : "No bookmarks yet"}
        </p>
        <p className="text-muted text-sm mt-1">
          {hasBookmarks
            ? "Try a different search or tag filter."
            : "Hit the button below to save your first link."}
        </p>
      </div>
      {!hasBookmarks && (
        <button
          onClick={onAdd}
          className="mt-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-head font-bold transition-all"
        >
          + Add your first bookmark
        </button>
      )}
    </div>
  );
}   