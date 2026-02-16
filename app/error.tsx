"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-5xl">⚠️</div>
        <h2 className="font-head font-bold text-xl text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-head font-bold text-sm transition-all"
        >
          Try again
        </button>
      </div>
    </main>
  );
}