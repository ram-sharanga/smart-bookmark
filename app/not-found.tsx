import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-6xl font-head font-extrabold text-accent">404</div>
        <h2 className="font-head font-bold text-xl text-foreground">
          Page not found
        </h2>
        <p className="text-muted text-sm">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl font-head font-bold text-sm transition-all"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}