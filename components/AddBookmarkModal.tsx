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
    if (isOpen) setTimeout(() => urlInputRef.current?.focus(), 80);
    else { setUrl(""); setTitle(""); setTagInput(""); setTags([]); setLoading(false); }
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
      if (newTag && !tags.includes(newTag) && tags.length < 8) setTags([...tags, newTag]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) setTags(tags.slice(0, -1));
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
    }
  }

  if (!isOpen) return null;

  const inputStyle = {
    background: "var(--input-bg)",
    border: "1.5px solid var(--input-border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    marginBottom: "6px",
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="w-full sm:max-w-md"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--card-border)",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -4px 40px rgba(0,0,0,0.12)",
            padding: "24px",
          }}
          // Desktop — round all corners
          ref={(el) => {
            if (el && window.innerWidth >= 640) {
              el.style.borderRadius = "20px";
            }
          }}
        >
          {/* Mobile drag handle */}
          <div
            className="w-9 h-1 mx-auto rounded-full mb-5 sm:hidden"
            style={{ background: "var(--divider)" }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-head)", color: "var(--text-primary)" }}
            >
              Add a bookmark
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-tertiary)",
                border: "1px solid var(--divider)",
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">

              {/* URL */}
              <div>
                <label style={labelStyle}>URL</label>
                <input
                  ref={urlInputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://example.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlurCapture={(e) => (e.target.style.borderColor = "var(--input-border)")}
                />
              </div>

              {/* Title */}
              <div>
                <label style={labelStyle}>
                  Title
                  {fetchingTitle && (
                    <span style={{ color: "var(--accent)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                      {" "}— fetching…
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlurCapture={(e) => (e.target.style.borderColor = "var(--input-border)")}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={labelStyle}>
                  Tags
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                    {" "}— Enter or comma to add
                  </span>
                </label>
                <div
                  className="flex flex-wrap gap-1.5 min-h-[44px] p-2.5 transition-all"
                  style={{
                    background: "var(--input-bg)",
                    border: "1.5px solid var(--input-border)",
                    borderRadius: "10px",
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--accent-light)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-shadow)",
                      }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="opacity-60 hover:opacity-100 leading-none"
                      >✕</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "design, productivity, dev…" : ""}
                    className="flex-1 min-w-[80px] bg-transparent text-sm outline-none"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-all"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--divider)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "0 2px 12px var(--accent-shadow)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {loading && (
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
                    />
                  )}
                  {loading ? "Saving…" : "Save bookmark"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}