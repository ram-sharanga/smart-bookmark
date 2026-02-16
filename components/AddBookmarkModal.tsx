"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { addBookmark } from "@/app/actions/bookmarks";
import { useToast } from "./Toast";

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

  // Focus URL input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => urlInputRef.current?.focus(), 100);
    } else {
      // Reset form on close
      setUrl("");
      setTitle("");
      setTagInput("");
      setTags([]);
    }
  }, [isOpen]);

  // Auto-fetch page title when URL is entered
  async function handleUrlBlur() {
    if (!url || title) return;
    try {
      new URL(url);
    } catch {
      return;
    }

    setFetchingTitle(true);
    try {
      const res = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.title) setTitle(data.title);
    } catch {
      // silently fail — user can type title manually
    } finally {
      setFetchingTitle(false);
    }
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

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await addBookmark({ url, title, tags });

    if (result.error) {
      onError(result.error);
    } else {
      onSuccess("Bookmark saved!");
      onClose();
    }

    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-card border border-card-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-[var(--shadow-md)] p-6 space-y-5">
          {/* Handle (mobile) */}
          <div className="w-10 h-1 bg-card-border rounded-full mx-auto sm:hidden" />

          <div className="flex items-center justify-between">
            <h2 className="font-head text-xl font-bold text-foreground">
              Add Bookmark
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-input-bg hover:text-foreground transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                URL
              </label>
              <input
                ref={urlInputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                required
                className="w-full bg-input-bg border border-card-border rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Title
                {fetchingTitle && (
                  <span className="ml-2 text-accent normal-case font-normal">
                    fetching…
                  </span>
                )}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                required
                className="w-full bg-input-bg border border-card-border rounded-xl px-4 py-3 text-sm text-foreground font-body placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Tags{" "}
                <span className="normal-case font-normal text-muted">
                  (press Enter or comma to add)
                </span>
              </label>
              <div className="bg-input-bg border border-card-border rounded-xl px-3 py-2.5 flex flex-wrap gap-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all min-h-[46px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-danger transition-colors leading-none"
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
                  placeholder={tags.length === 0 ? "design, tools, ai…" : ""}
                  className="flex-1 min-w-[80px] bg-transparent text-sm text-foreground font-body placeholder:text-muted focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-card-border rounded-xl py-3 text-sm font-body font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent hover:bg-accent-hover text-white rounded-xl py-3 text-sm font-head font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : null}
                {loading ? "Saving…" : "Save Bookmark"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}