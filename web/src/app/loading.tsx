export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-edge"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-accent-500 border-t-transparent"></div>
        </div>
        <p className="text-ink-subtle animate-pulse">Memuat...</p>
      </div>
    </div>
  );
}