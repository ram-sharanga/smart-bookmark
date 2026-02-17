"use client";
import { useState } from "react";
import Image from "next/image";
import type { Bookmark } from "@/types/bookmark";
import { deleteBookmark } from "@/app/actions/bookmarks";

type Props = {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onError: (msg: string) => void;
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  deleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-(--bg-card) border border-(--border) p-6 rounded-2xl shadow-2xl max-w-xs w-full mx-4 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-serif font-bold text-(--text-1) mb-2">
          Delete Bookmark?
        </h3>
        <p className="text-sm text-(--text-3) mb-6">
          This action cannot be undone. Are you sure?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-(--bg-subtle) text-(--text-2) text-sm font-medium hover:bg-(--divider) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getFaviconUrl = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
};

export function BookmarkCard({ bookmark, onDelete, onError }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const r = await deleteBookmark(bookmark.id);
    if (r.error) {
      onError(r.error);
      setIsDeleting(false);
      setShowModal(false);
    } else {
      onDelete(bookmark.id);
    }
  };

  const handleCardClick = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex items-center gap-4 p-3.5 h-25 w-full bg-(--bg-card) border border-(--border-card) rounded-xl transition-all hover:border-(--accent-s) hover:-translate-y-0.5 hover:shadow-(--shadow-hover) shadow-(--shadow-card) cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-(--bg-subtle) border border-(--divider) relative p-3">
          {getFaviconUrl(bookmark.url) && !faviconError ? (
            <div className="relative w-full h-full">
              <Image
                src={getFaviconUrl(bookmark.url)!}
                alt=""
                fill
                unoptimized
                className="object-contain"
                onError={() => setFaviconError(true)}
              />
            </div>
          ) : (
            <span className="text-xl font-bold text-(--accent) font-serif">
              {bookmark.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-(--text-1) truncate leading-tight mb-1">
            {bookmark.title}
          </h3>
          <p className="text-xs text-(--text-3) mb-2 truncate">
            {new URL(bookmark.url).hostname.replace("www.", "")}
          </p>

          <div className="flex gap-1 overflow-hidden">
            {bookmark.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-(--tag-bg) text-(--tag-col) border border-(--border) shrink-0"
              >
                #{tag}
              </span>
            ))}
            {bookmark.tags.length > 2 && (
              <span className="text-[10px] text-(--text-3) self-center">
                +{bookmark.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 text-(--text-3) hover:text-red-500"
          title="Delete Bookmark"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        deleting={isDeleting}
      />
    </>
  );
}
