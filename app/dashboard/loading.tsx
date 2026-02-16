export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 bg-card border-b border-card-border h-14 flex items-center px-4">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <div className="w-32 h-5 bg-input-bg rounded-lg animate-pulse" />
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 bg-input-bg rounded-full animate-pulse" />
            <div className="w-16 h-4 bg-input-bg rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 h-10 bg-card border border-card-border rounded-xl animate-pulse" />
          <div className="w-28 h-10 bg-card border border-card-border rounded-xl animate-pulse" />
          <div className="w-36 h-10 bg-accent/20 rounded-xl animate-pulse" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-card-border rounded-2xl p-4 flex gap-3 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-8 h-8 bg-input-bg rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-input-bg rounded-md" />
              <div className="w-1/2 h-3 bg-input-bg rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}