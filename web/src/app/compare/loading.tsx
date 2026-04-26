export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-48 rounded bg-surface animate-pulse" />
          <div className="mx-auto h-4 w-64 rounded bg-surface animate-pulse" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-surface p-6 animate-pulse">
              <div className="mb-4 h-32 rounded-xl bg-surface-raised" />
              <div className="mb-2 h-6 w-3/4 rounded bg-surface-raised" />
              <div className="mb-4 h-4 w-1/2 rounded bg-surface-raised" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-20 rounded bg-surface-raised" />
                    <div className="h-4 w-24 rounded bg-surface-raised" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}