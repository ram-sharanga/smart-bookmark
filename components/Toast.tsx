"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";
export type ToastMessage = { id: string; message: string; type: ToastType };

export function ToastContainer({ toasts, removeToast }: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 items-center w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }: { toast: ToastMessage; removeToast: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => removeToast(toast.id), 300);
    }, 3500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [toast.id, removeToast]);

  const styles = {
    success: { bg: "var(--bg-card)", accent: "var(--success)", icon: "✓" },
    error:   { bg: "var(--bg-card)", accent: "var(--danger)",  icon: "✕" },
    info:    { bg: "var(--bg-card)", accent: "var(--accent)",   icon: "ℹ" },
  }[toast.type];

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 text-sm font-medium cursor-pointer select-none"
      style={{
        background: styles.bg,
        border: "1px solid var(--card-border)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
        minWidth: "220px",
        maxWidth: "360px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
      onClick={() => { setVisible(false); setTimeout(() => removeToast(toast.id), 300); }}
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
  function addToast(message: string, type: ToastType = "info") {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), message, type }]);
  }
  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }
  return { toasts, addToast, removeToast };
}