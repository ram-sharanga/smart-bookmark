"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./BookmarkCard";
import { ToastContainer, useToast } from "./Toast";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { createClient } from "@/utils/supabase/client";

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
  const bookmarksRef = useRef<Bookmark[]>(initialBookmarks);

  useEffect(() => {
    bookmarksRef.current = bookmarks;
  }, [bookmarks]);

  // Realtime subscription — inline, no custom hook, no stale closure
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.find((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
          addToast("Bookmark added!", "success");
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedId = payload.old.id as string;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✓ Realtime connected");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "var(--text-tertiary)" }}>
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks…"
            className="w-full pl-10 pr-10 py-2.5 text-sm outline-none transition-all"
            style={{
              background: "var(--input-bg)",
              border: "1.5px solid var(--input-border)",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-tertiary)" }}>✕</button>
          )}
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          className="px-3 py-2.5 text-sm outline-none cursor-pointer"
          style={{
            background: "var(--input-bg)",
            border: "1.5px solid var(--input-border)",
            borderRadius: "10px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A → Z</option>
        </select>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-all duration-150 active:scale-95"
          style={{
            background: "var(--accent)",
            borderRadius: "10px",
            boxShadow: "0 2px 12px var(--accent-shadow)",
            fontFamily: "var(--font-body)",
          }}
        >
          <span className="text-base leading-none">+</span>
          Add Bookmark
          <span className="hidden sm:inline text-xs opacity-70 font-normal">⌘K</span>
        </button>
      </div>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {["All", ...allTags].map((tag) => {
            const isAll = tag === "All";
            const isActive = isAll ? activeTag === null : activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(isAll ? null : activeTag === tag ? null : tag)}
                className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-150"
                style={{
                  background: isActive ? "var(--accent)" : "var(--tag-bg)",
                  color: isActive ? "white" : "var(--text-secondary)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--tag-border)"}`,
                }}
              >
                {isAll ? "All" : `#${tag}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Count */}
      <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-body)" }}>
        {filtered.length === bookmarks.length
          ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${bookmarks.length} bookmarks`}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState hasBookmarks={bookmarks.length > 0} onAdd={() => setIsModalOpen(true)} />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={(id) => {
                setBookmarks((prev) => prev.filter((b) => b.id !== id));
              }}
              onError={(msg) => addToast(msg, "error")}
            />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({ hasBookmarks, onAdd }: { hasBookmarks: boolean; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1" style={{ background: "var(--empty-icon-bg)" }}>
        {hasBookmarks ? "🔍" : "🔖"}
      </div>
      <p className="font-semibold text-base" style={{ color: "var(--text-primary)", fontFamily: "var(--font-head)" }}>
        {hasBookmarks ? "No matches found" : "Nothing saved yet"}
      </p>
      <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        {hasBookmarks ? "Try a different search or clear the filter." : "Hit Add Bookmark to save your first link."}
      </p>
      {!hasBookmarks && (
        <button
          onClick={onAdd}
          className="mt-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
          style={{ background: "var(--accent)", boxShadow: "0 2px 12px var(--accent-shadow)" }}
        >
          + Add your first bookmark
        </button>
      )}
    </div>
  );
}