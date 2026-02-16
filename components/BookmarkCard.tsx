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
  } catch {
    return null;
  }
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
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
    <div className="group bg-card border border-card-border rounded-2xl p-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="w-8 h-8 rounded-lg bg-input-bg flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
          {favicon && !faviconError ? (
            <img
              src={favicon}
              alt=""
              width={16}
              height={16}
              onError={() => setFaviconError(true)}
              className="w-4 h-4"
            />
          ) : (
            <span className="text-muted text-xs font-bold">
              {bookmark.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-head font-semibold text-sm text-foreground hover:text-accent transition-colors line-clamp-1 block"
          >
            {bookmark.title}
          </a>
          <span className="text-xs text-muted truncate block mt-0.5">
            {getDomain(bookmark.url)}
          </span>

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all text-sm"
            title="Open link"
          >
            ↗
          </a>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-all text-sm"
              title="Delete bookmark"
            >
              🗑
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2 py-1 text-xs font-bold bg-danger text-white rounded-lg hover:bg-danger-hover transition-colors disabled:opacity-50"
              >
                {deleting ? "…" : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs font-medium border border-card-border text-muted rounded-lg hover:text-foreground transition-colors"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}