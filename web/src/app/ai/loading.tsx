export default function AILoading() {
  return (
    <div className="min-h-screen bg-surface-subtle py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-8 w-48 rounded bg-surface animate-pulse" />
            <div className="mx-auto h-4 w-64 rounded bg-surface animate-pulse" />
          </div>
          
          <div className="rounded-2xl bg-surface p-6 animate-pulse">
            <div className="mb-6 space-y-4">
              <div className="h-4 w-3/4 rounded bg-surface-raised" />
              <div className="h-4 w-full rounded bg-surface-raised" />
              <div className="h-4 w-5/6 rounded bg-surface-raised" />
            </div>
            
            <div className="flex gap-2">
              <div className="h-12 flex-1 rounded-xl bg-surface-raised" />
              <div className="h-12 w-12 rounded-xl bg-accent-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}