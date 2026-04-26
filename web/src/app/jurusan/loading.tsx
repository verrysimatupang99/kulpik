export default function JurusanLoading() {
  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-64 rounded bg-surface animate-pulse" />
          <div className="mx-auto h-4 w-96 rounded bg-surface animate-pulse" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="rounded-2xl bg-surface p-6 animate-pulse">
              <div className="mb-4 h-12 w-12 rounded-full bg-surface-raised" />
              <div className="mb-2 h-6 w-32 rounded bg-surface-raised" />
              <div className="mb-4 h-4 w-24 rounded bg-surface-raised" />
              <div className="h-10 w-full rounded bg-surface-raised" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}