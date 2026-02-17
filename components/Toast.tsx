"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";
export type ToastMessage = { id: string; message: string; type: ToastType };

export function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 items-center w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  removeToast,
}: {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => removeToast(toast.id), 300);
    }, 3500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [toast.id, removeToast]);

  const styles = {
    success: { bg: "var(--bg-card)", accent: "var(--success)", icon: "✓" },
    error: { bg: "var(--bg-card)", accent: "var(--danger)", icon: "✕" },
    info: { bg: "var(--bg-card)", accent: "var(--accent)", icon: "ℹ" },
  }[toast.type];

  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium cursor-pointer select-none"
      style={{
        background: styles.bg,
        border: "1px solid var(--border-card)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,.12)",
        color: "var(--text-1)",
        minWidth: "200px",
        maxWidth: "360px",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(8px) scale(0.96)",
        transition: "all .25s cubic-bezier(.16,1,.3,1)",
      }}
      onClick={() => {
        setVisible(false);
        setTimeout(() => removeToast(toast.id), 300);
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: styles.accent }}
      >
        {styles.icon}
      </span>
      {toast.message}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  function addToast(m: string, type: ToastType = "info") {
    setToasts((p) => [...p, { id: crypto.randomUUID(), message: m, type }]);
  }
  function removeToast(id: string) {
    setToasts((p) => p.filter((t) => t.id !== id));
  }
  return { toasts, addToast, removeToast };
}
