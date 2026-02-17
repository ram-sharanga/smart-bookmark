"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import type { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./BookmarkCard";
import { ToastContainer, useToast } from "./Toast";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { createClient } from "@/utils/supabase/client";

type Props = { initialBookmarks: Bookmark[]; userId: string };
type SortOrder = "newest" | "oldest" | "alpha";

const LinkCountBadge = ({ count }: { count: number }) => (
  <span className="inline-flex items-center justify-center h-5.5 rounded-full bg-(--accent-l) text-(--accent) text-[11px] font-medium leading-none whitespace-nowrap shrink-0 px-2.5">
    {count} {count === 1 ? "link" : "links"}
  </span>
);

const SearchControls = ({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  onAdd,
}: {
  search: string;
  setSearch: (v: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
  onAdd: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { label: string; value: SortOrder }[] = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "A - Z", value: "alpha" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-full sm:flex-1 relative flex items-center">
        <span className="absolute left-3.5 text-[22px] text-(--text-3) pointer-events-none -mt-1">
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full outline-none bg-(--bg-card) border border-(--border) rounded-[10px] text-(--text-1) py-2.5 pl-10 pr-3 text-[13px] focus:border-(--accent) transition-all"
        />
      </div>

      <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full h-full flex items-center justify-between gap-3 bg-(--bg-card) border border-(--border) rounded-[10px] text-(--text-2) px-3 py-2.5 text-[13px] transition-all min-w-27.5 ${
            isDropdownOpen
              ? "border-(--accent) ring-1 ring-(--accent-l)"
              : "hover:border-(--text-3)"
          }`}
        >
          <span>{sortOptions.find((o) => o.value === sortOrder)?.label}</span>
          <span
            className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-(--bg-card) border border-(--border) rounded-[10px] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortOrder(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-[13px] transition-colors ${
                  sortOrder === option.value
                    ? "bg-(--accent) text-white"
                    : "text-(--text-2) hover:bg-(--bg-subtle)"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 text-white bg-(--accent) rounded-[10px] px-4.5 py-2.5 text-[13px] font-semibold shadow-(--shadow-btn) active:scale-95 transition-transform"
      >
        <span className="text-lg leading-none">+</span>
        <span>Add Bookmark</span>
        <span className="hidden sm:inline-flex items-center bg-white/20 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-tight ml-1">
          ⌘K
        </span>
      </button>
    </div>
  );
};

const TagFilters = ({
  tags,
  activeTag,
  setActiveTag,
}: {
  tags: string[];
  activeTag: string | null;
  setActiveTag: (t: string | null) => void;
}) => (
  <div className="flex flex-wrap gap-2.25">
    {([null, ...tags] as (string | null)[]).map((tag) => (
      <button
        key={tag || "all"}
        onClick={() => setActiveTag(tag === activeTag ? null : tag)}
        className={`text-[12px] font-medium rounded-full px-3 py-1 transition-all border ${
          tag === activeTag
            ? "bg-(--accent) text-white border-(--accent)"
            : "bg-(--bg-card) text-(--text-2) border-(--border) hover:border-(--text-3)"
        }`}
      >
        {tag ? `#${tag}` : "All"}
      </button>
    ))}
  </div>
);

const EmptyState = ({
  hasBookmarks,
  onAdd,
}: {
  hasBookmarks: boolean;
  onAdd: () => void;
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-(--bg-subtle) border border-(--border) text-2xl">
      {hasBookmarks ? "🔍" : "🔖"}
    </div>
    <p className="font-semibold text-(--text-1) font-serif text-base">
      {hasBookmarks ? "No matches" : "Nothing saved yet"}
    </p>
    <p className="text-sm text-(--text-3) max-w-55 leading-relaxed">
      {hasBookmarks ? "Try a different search." : "Hit Add Bookmark to start."}
    </p>
    {!hasBookmarks && (
      <button
        onClick={onAdd}
        className="mt-2 bg-(--accent) text-white rounded-xl px-4.5 py-2.25 text-[13px] font-semibold shadow-(--shadow-btn) active:scale-95"
      >
        + Add first bookmark
      </button>
    )}
  </div>
);

export function BookmarkList({ initialBookmarks, userId }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`realtime-bookmarks-${userId}`)
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
            const exists = prev.some((b) => b.id === newBookmark.id);
            if (exists) return prev;

            return [newBookmark, ...prev];
          });

          addToast("Sync: New bookmark added", "success");
        },
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
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        },
      )
      .subscribe((status) => {
        console.log("Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, addToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [bookmarks]);

  const filtered = useMemo(() => {
    let res = [...bookmarks];
    if (activeTag) res = res.filter((b) => b.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q)),
      );
    }
    res.sort((a, b) => {
      if (sortOrder === "alpha") return a.title.localeCompare(b.title);
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
    return res;
  }, [bookmarks, activeTag, search, sortOrder]);

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(msg) => addToast(msg, "success")}
        onError={(msg) => addToast(msg, "error")}
      />

      <SearchControls
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onAdd={() => setIsModalOpen(true)}
      />

      {allTags.length > 0 && (
        <TagFilters
          tags={allTags}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-(--text-2)">Results</h2>
          <LinkCountBadge count={filtered.length} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            hasBookmarks={bookmarks.length > 0}
            onAdd={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                onDelete={(id) =>
                  setBookmarks((prev) => prev.filter((x) => x.id !== id))
                }
                onError={(msg) => addToast(msg, "error")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
