export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        {/* Search bar skeleton */}
        <div className="mb-8 h-12 w-full max-w-md rounded-xl bg-surface animate-pulse" />
        
        {/* Filters skeleton */}
        <div className="mb-8 flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 flex-shrink-0 rounded-lg bg-surface animate-pulse" />
          ))}
        </div>
        
        {/* Results grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-surface p-6 animate-pulse">
              <div className="mb-4 h-40 rounded-xl bg-surface-raised" />
              <div className="mb-2 h-6 w-3/4 rounded bg-surface-raised" />
              <div className="mb-4 h-4 w-1/2 rounded bg-surface-raised" />
              <div className="h-8 w-full rounded bg-surface-raised" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}