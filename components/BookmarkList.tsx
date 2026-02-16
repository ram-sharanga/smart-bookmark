"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

  // Ref so realtime handlers always read current bookmarks without stale closure
  const bookmarksRef = useRef<Bookmark[]>(initialBookmarks);
  useEffect(() => {
    bookmarksRef.current = bookmarks;
  }, [bookmarks]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === "Escape") setIsModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // No useCallback — let React compiler optimize freely
  function handleRealtimeInsert(bookmark: Bookmark) {
    if (bookmarksRef.current.find((b) => b.id === bookmark.id)) return;
    setBookmarks((prev) => [bookmark, ...prev]);
    addToast("Bookmark synced!", "success");
  }

  function handleRealtimeDelete(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  useRealtimeBookmarks({
    userId,
    onInsert: handleRealtimeInsert,
    onDelete: handleRealtimeDelete,
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  const filtered = useMemo(() => {
    let result = [...bookmarks];
    if (activeTag) result = result.filter((b) => b.tags.includes(activeTag));
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
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
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
        onSuccess={(msg) => addToast(msg, "success")}
        onError={(msg) => addToast(msg, "error")}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: "var(--text-secondary)" }}
          >
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks…"
            className="w-full rounded-[var(--radius-sm)] pl-10 pr-10 py-3 text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              backdropFilter: "var(--blur)",
              WebkitBackdropFilter: "var(--blur)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              boxShadow: "var(--shadow-card)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          className="rounded-[var(--radius-sm)] px-3 py-3 text-sm outline-none cursor-pointer transition-all"
          style={{
            background: "var(--surface)",
            backdropFilter: "var(--blur)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A → Z</option>
        </select>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-white rounded-[var(--radius-sm)] px-5 py-3 text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2"
          style={{
            background: "var(--accent)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
        >
          <span className="text-base leading-none font-black">+</span>
          Add Bookmark
          <span className="hidden sm:inline text-xs opacity-60 font-normal ml-1">⌘K</span>
        </button>
      </div>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActiveTag(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: activeTag === null ? "var(--accent)" : "var(--surface)",
              color: activeTag === null ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                background: activeTag === tag ? "var(--accent)" : "var(--surface)",
                color: activeTag === tag ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
        {filtered.length === bookmarks.length
          ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${bookmarks.length}`}
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
              onDelete={(id) => {
                setBookmarks((prev) => prev.filter((b) => b.id !== id));
                addToast("Deleted.", "info");
              }}
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
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div className="text-5xl">{hasBookmarks ? "🔍" : "🔖"}</div>
      <div>
        <p
          className="font-[family-name:var(--font-head)] font-bold text-lg"
          style={{ color: "var(--text)" }}
        >
          {hasBookmarks ? "No matches found" : "Nothing saved yet"}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {hasBookmarks
            ? "Try a different search or tag."
            : "Start saving links you love."}
        </p>
      </div>
      {!hasBookmarks && (
        <button
          onClick={onAdd}
          className="mt-2 text-white rounded-[var(--radius-sm)] px-6 py-2.5 text-sm font-bold transition-all"
          style={{
            background: "var(--accent)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
          }}
        >
          + Add your first bookmark
        </button>
      )}
    </div>
  );
}