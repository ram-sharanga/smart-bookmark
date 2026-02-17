export default function DashboardLoading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-30"
        style={{
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
          height: "52px",
        }}
      >
        <div className="max-w-2xl mx-auto px-5 h-full flex items-center justify-between">
          <div
            className="w-28 h-5 rounded-full animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
          <div className="flex gap-2">
            <div
              className="w-16 h-6 rounded-full animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
            <div
              className="w-8 h-8 rounded-full animate-pulse"
              style={{ background: "var(--bg-subtle)" }}
            />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-5 py-7">
        <div className="mb-6 space-y-2">
          <div
            className="w-40 h-7 rounded-xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
          <div
            className="w-56 h-4 rounded-full animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
        </div>
        <div className="flex gap-2 mb-5">
          <div
            className="flex-1 h-10 rounded-xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
          <div
            className="w-24 h-10 rounded-xl animate-pulse"
            style={{ background: "var(--bg-subtle)" }}
          />
          <div
            className="w-36 h-10 rounded-xl animate-pulse"
            style={{ background: "var(--bg-subtle)", opacity: 0.7 }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 animate-pulse"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "12px",
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div
                className="w-8.5 h-8.5 rounded-lg shrink-0"
                style={{ background: "var(--bg-subtle)" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-3.5 rounded-full w-3/5"
                  style={{ background: "var(--bg-subtle)" }}
                />
                <div
                  className="h-3 rounded-full w-2/5"
                  style={{ background: "var(--bg-subtle)", opacity: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
