"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/bookmark";
import { deleteBookmark } from "@/app/actions/bookmarks";

type Props = {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onError: (message: string) => void;
};

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch { return null; }
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function BookmarkCard({ bookmark, onDelete, onError }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const favicon = getFaviconUrl(bookmark.url);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteBookmark(bookmark.id);
    if (result.error) {
      onError(result.error);
      setDeleting(false);
      setShowConfirm(false);
    } else {
      // Optimistic: update local state immediately
      // Realtime will also fire but duplicate check in BookmarkList handles it
      onDelete(bookmark.id);
    }
  }

  return (
    <div
      className="glass rounded-[var(--radius)] p-4 transition-all duration-200 hover:scale-[1.01] group"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start gap-3">

        {/* Favicon */}
        <div
          className="w-10 h-10 rounded-[var(--radius-xs)] flex items-center justify-center shrink-0 overflow-hidden mt-0.5"
          style={{
            background: "var(--surface-solid)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {favicon && !faviconError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={20}
              height={20}
              onError={() => setFaviconError(true)}
              className="w-5 h-5 object-contain"
            />
          ) : (
            <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              {bookmark.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm leading-tight block truncate transition-colors duration-150 hover:opacity-70"
            style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}
          >
            {bookmark.title}
          </a>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {getDomain(bookmark.url)}
            </span>
            <span className="text-xs" style={{ color: "var(--border-subtle)" }}>·</span>
            <span className="text-xs shrink-0" style={{ color: "var(--text-secondary)" }}>
              {timeAgo(bookmark.created_at)}
            </span>
          </div>

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!showConfirm ? (
            <>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-sm transition-all duration-150"
                style={{ color: "var(--text-secondary)" }}
                title="Open"
              >
                ↗
              </a>
              <button
                onClick={() => setShowConfirm(true)}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-sm transition-all duration-150"
                style={{ color: "var(--text-secondary)" }}
                title="Delete"
              >
                🗑
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1 text-xs font-bold rounded-[var(--radius-xs)] text-white transition-all disabled:opacity-50"
                style={{ background: "var(--danger)" }}
              >
                {deleting ? "…" : "Delete"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2.5 py-1 text-xs font-medium rounded-[var(--radius-xs)] transition-all"
                style={{
                  background: "var(--surface)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}