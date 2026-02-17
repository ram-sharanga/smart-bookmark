"use client";

import { useState, useMemo, useEffect } from "react";
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

  // Realtime subscription — inline, simple, no stale closures
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
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: "var(--text-tertiary)" }}
          >
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, URL or tag…"
            className="w-full pl-9 pr-3 py-2.5 text-sm outline-none transition-all"
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--input-border)",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontFamily: "'Geist', sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
          className="px-3 py-2.5 text-sm outline-none cursor-pointer"
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--input-border)",
            borderRadius: "10px",
            color: "var(--text-secondary)",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A → Z</option>
        </select>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-all duration-150 active:scale-95"
          style={{
            background: "var(--accent)",
            borderRadius: "10px",
            boxShadow: "0 2px 8px var(--accent-shadow)",
            fontFamily: "'Geist', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "none";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <span className="text-base leading-none">+</span>
          Add Bookmark
          <span className="hidden sm:inline text-[10px] opacity-60 font-normal">⌘K</span>
        </button>
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setActiveTag(null)}
            className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-150"
            style={{
              background: activeTag === null ? "var(--accent)" : "var(--bg-card)",
              color: activeTag === null ? "white" : "var(--text-secondary)",
              border: `1px solid ${activeTag === null ? "var(--accent)" : "var(--input-border)"}`,
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-150"
              style={{
                background: activeTag === tag ? "var(--accent)" : "var(--bg-card)",
                color: activeTag === tag ? "white" : "var(--text-secondary)",
                border: `1px solid ${activeTag === tag ? "var(--accent)" : "var(--input-border)"}`,
              }}
              onMouseEnter={(e) => {
                if (activeTag !== tag) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTag !== tag) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--input-border)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)", fontFamily: "'Geist', sans-serif" }}>
        {filtered.length === bookmarks.length
          ? `${bookmarks.length} bookmark${bookmarks.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${bookmarks.length} bookmarks`}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState hasBookmarks={bookmarks.length > 0} onAdd={() => setIsModalOpen(true)} />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
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
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
        style={{
          background: "var(--empty-icon-bg)",
          border: "1px solid var(--divider)",
        }}
      >
        {hasBookmarks ? "🔍" : "🔖"}
      </div>
      <p
        className="font-semibold text-base"
        style={{ color: "var(--text-primary)", fontFamily: "'Instrument Serif', serif" }}
      >
        {hasBookmarks ? "No matches found" : "Nothing saved yet"}
      </p>
      <p className="text-sm" style={{ color: "var(--text-tertiary)", maxWidth: "220px", lineHeight: "1.5" }}>
        {hasBookmarks ? "Try a different search or clear the filter." : "Hit Add Bookmark to save your first link."}
      </p>
      {!hasBookmarks && (
        <button
          onClick={onAdd}
          className="mt-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
          style={{ background: "var(--accent)", boxShadow: "0 2px 8px var(--accent-shadow)" }}
        >
          + Add your first bookmark
        </button>
      )}
    </div>
  );
}