"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { addBookmark } from "@/app/actions/bookmarks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
};

export function AddBookmarkModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const [titleFetched, setTitleFetched] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => urlInputRef.current?.focus(), 80);
    } else {
      setUrl("");
      setTitle("");
      setTagInput("");
      setTags([]);
      setLoading(false);
      setTitleFetched(false);
    }
  }, [isOpen]);

  async function handleUrlBlur() {
    if (!url || title) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    setFetchingTitle(true);
    setTitleFetched(false);
    try {
      const res = await fetch(
        `/api/fetch-title?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      if (data.title) {
        setTitle(data.title);
        setTitleFetched(true);
      }
    } catch {
    } finally {
      setFetchingTitle(false);
    }
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      if (newTag && !tags.includes(newTag) && tags.length < 8)
        setTags([...tags, newTag]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0)
      setTags(tags.slice(0, -1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await addBookmark({ url, title, tags });
    if (r.error) {
      onError(r.error);
      setLoading(false);
    } else {
      onSuccess("Bookmark saved!");
      onClose();
    }
  }

  if (!isOpen) return null;

  const inputStyle = {
    background: "var(--input-bg)",
    border: "1.5px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-1)",
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "var(--text-3)",
    marginBottom: "6px",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,.3)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "0 -8px 40px rgba(0,0,0,.15)",
          }}
        >
          <div
            className="w-9 h-1 mx-auto rounded-full mb-5 sm:hidden"
            style={{ background: "var(--divider)" }}
          />
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{
                fontFamily: "'Instrument Serif',serif",
                color: "var(--text-1)",
              }}
            >
              Add a bookmark
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-3)",
                border: "1px solid var(--divider)",
              }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3.5">
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
                  className="form-input"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Title{" "}
                  {titleFetched && (
                    <span
                      style={{
                        color: "var(--accent)",
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      — auto-fetched ✓
                    </span>
                  )}
                  {fetchingTitle && (
                    <span
                      style={{
                        color: "var(--accent)",
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      — fetching…
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
                  className="form-input"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Tags{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    — Enter or comma
                  </span>
                </label>
                <div
                  className="flex flex-wrap gap-1.5 min-h-11 p-2.5 tags-input-wrap"
                  style={{
                    background: "var(--input-bg)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "10px",
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--accent-l)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-s)",
                      }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="opacity-60 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={
                      tags.length === 0 ? "design, productivity…" : ""
                    }
                    className="flex-1 min-w-20 bg-transparent text-sm outline-none"
                    style={{ color: "var(--text-1)" }}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors"
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-2)",
                    border: "1px solid var(--divider)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--divider)";
                    e.currentTarget.style.color = "var(--text-2)";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "var(--shadow-btn)",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.08)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {loading && (
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "rgba(255,255,255,.3)",
                        borderTopColor: "white",
                      }}
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
