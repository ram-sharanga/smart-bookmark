import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-head text-2xl font-bold text-foreground">
          Authentication failed
        </h1>
        <p className="text-muted text-sm max-w-xs mx-auto">
          Something went wrong during sign-in. This can happen if you denied
          access or if the link expired.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2.5 bg-accent text-white rounded-lg font-head font-bold text-sm hover:bg-accent-hover transition-colors"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}