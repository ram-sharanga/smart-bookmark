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
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
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
      onDelete(bookmark.id);
    }
  }

  return (
    <div
      className="group relative flex items-start gap-3 p-4 transition-all duration-150"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-shadow-hover)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-shadow)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-shadow)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)";
      }}
    >
      {/* Favicon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--divider)",
          marginTop: "1px",
        }}
      >
        {favicon && !faviconError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            width={18}
            height={18}
            onError={() => setFaviconError(true)}
            className="w-[18px] h-[18px] object-contain"
          />
        ) : (
          <span
            className="text-xs font-bold"
            style={{ color: "var(--accent)", fontFamily: "var(--font-head)" }}
          >
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
          className="block text-sm font-medium truncate mb-0.5 transition-colors duration-100"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-primary)")}
        >
          {bookmark.title}
        </a>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
            {getDomain(bookmark.url)}
          </span>
          <span style={{ color: "var(--divider)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
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
                  background: "var(--tag-bg)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--tag-border)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions — always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        {!showConfirm ? (
          <>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-150"
              style={{ color: "var(--text-tertiary)", background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-subtle)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-tertiary)";
              }}
              title="Open"
            >
              ↗
            </a>
            <button
              onClick={() => setShowConfirm(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-150"
              style={{ color: "var(--text-tertiary)", background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-subtle)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
              }}
              title="Delete"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg text-white transition-all disabled:opacity-50"
              style={{ background: "var(--danger)" }}
            >
              {deleting ? "…" : "Delete"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg transition-all"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-secondary)",
                border: "1px solid var(--divider)",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}