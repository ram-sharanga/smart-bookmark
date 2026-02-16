export default function DashboardLoading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-30 h-16"
        style={{
          background: "var(--surface)",
          backdropFilter: "var(--blur)",
          borderBottom: "1px solid var(--border-subtle)",
        }}>
        <div className="max-w-2xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="w-32 h-5 rounded-full animate-pulse" style={{ background: "var(--surface-solid)" }} />
          <div className="flex gap-2">
            <div className="w-20 h-6 rounded-full animate-pulse" style={{ background: "var(--surface-solid)" }} />
            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: "var(--surface-solid)" }} />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        <div className="flex gap-3 mb-5">
          <div className="flex-1 h-12 rounded-[var(--radius-sm)] animate-pulse" style={{ background: "var(--surface)" }} />
          <div className="w-24 h-12 rounded-[var(--radius-sm)] animate-pulse" style={{ background: "var(--surface)" }} />
          <div className="w-36 h-12 rounded-[var(--radius-sm)] animate-pulse" style={{ background: "var(--accent-light)" }} />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i}
            className="glass rounded-[var(--radius)] p-4 flex gap-3 animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-[var(--radius-xs)] flex-shrink-0" style={{ background: "var(--border-subtle)" }} />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 rounded-full w-3/4" style={{ background: "var(--border-subtle)" }} />
              <div className="h-3 rounded-full w-1/2" style={{ background: "var(--border-subtle)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}