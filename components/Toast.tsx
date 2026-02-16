"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";
export type ToastMessage = { id: string; message: string; type: ToastType };

export function ToastContainer({ toasts, removeToast }: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full px-4 sm:px-0">
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
    }, 4000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [toast.id, removeToast]);

  const config = {
    success: { bg: "var(--success)", icon: "✓" },
    error:   { bg: "var(--danger)",  icon: "✕" },
    info:    { bg: "var(--accent)",  icon: "ℹ" },
  }[toast.type];

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(() => removeToast(toast.id), 300); }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 text-white text-sm font-medium"
      style={{
        background: config.bg,
        boxShadow: "var(--shadow-lg)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
      }}
    >
      <span className="font-bold text-base">{config.icon}</span>
      <span className="flex-1">{toast.message}</span>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(message: string, type: ToastType = "info") {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, removeToast };
}