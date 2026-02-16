"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { addBookmark } from "@/app/actions/bookmarks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function AddBookmarkModal({ isOpen, onClose, onSuccess, onError }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => urlInputRef.current?.focus(), 100);
    } else {
      setUrl(""); setTitle(""); setTagInput(""); setTags([]);
    }
  }, [isOpen]);

  async function handleUrlBlur() {
    if (!url || title) return;
    try { new URL(url); } catch { return; }
    setFetchingTitle(true);
    try {
      const res = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.title) setTitle(data.title);
    } catch { /* silent */ }
    finally { setFetchingTitle(false); }
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (newTag && !tags.includes(newTag) && tags.length < 8) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await addBookmark({ url, title, tags });
    if (result.error) {
      onError(result.error);
      setLoading(false);
    } else {
      onSuccess("Bookmark saved!");
      onClose();
      // Don't setLoading(false) — modal closes, realtime will add to list
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose} />

      {/* Sheet — bottom on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[var(--radius)] p-6 space-y-5"
          style={{
            background: "var(--surface-solid)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Mobile handle */}
          <div className="w-10 h-1 rounded-full mx-auto sm:hidden"
            style={{ background: "var(--border-subtle)" }} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-head)] text-xl font-bold"
              style={{ color: "var(--text)" }}>
              Add Bookmark
            </h2>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xs)] text-sm transition-all"
              style={{ color: "var(--text-secondary)", background: "var(--surface)" }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}>URL</label>
              <input
                ref={urlInputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                required
                className="w-full rounded-[var(--radius-sm)] px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-light)";
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "var(--border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}>
                Title {fetchingTitle && <span style={{ color: "var(--accent)" }} className="normal-case font-normal">— fetching…</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                required
                className="w-full rounded-[var(--radius-sm)] px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = "0 0 0 3px var(--accent-light)";
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "var(--border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}>
                Tags <span className="normal-case font-normal">— press Enter or comma to add</span>
              </label>
              <div
                className="rounded-[var(--radius-sm)] px-3 py-2.5 flex flex-wrap gap-1.5 min-h-[46px] transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {tags.map((tag) => (
                  <span key={tag}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                    #{tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="hover:opacity-60 transition-opacity">✕</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "design, tools, ai…" : ""}
                  className="flex-1 min-w-[80px] bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-[var(--radius-sm)] py-3 text-sm font-medium transition-all"
                style={{
                  background: "var(--surface)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 text-white rounded-[var(--radius-sm)] py-3 text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--accent)", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Saving…" : "Save Bookmark"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}