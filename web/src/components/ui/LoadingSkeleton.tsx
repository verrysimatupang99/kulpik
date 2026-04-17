interface SkeletonProps {
  variant?: "card" | "text" | "circle" | "table";
  count?: number;
}

export default function LoadingSkeleton({ variant = "card", count = 1 }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="animate-pulse rounded-2xl border border-dark-600 bg-dark-800 p-5">
            <div className="mb-4 h-40 rounded-xl bg-dark-700" />
            <div className="mb-2 h-4 w-3/4 rounded bg-dark-700" />
            <div className="mb-4 h-3 w-1/2 rounded bg-dark-700" />
            <div className="flex gap-2">
              <div className="h-3 w-16 rounded bg-dark-700" />
              <div className="h-3 w-16 rounded bg-dark-700" />
              <div className="h-3 w-16 rounded bg-dark-700" />
            </div>
          </div>
        );
      case "circle":
        return <div className="h-10 w-10 animate-pulse rounded-full bg-dark-700" />;
      case "table":
        return (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-20 animate-pulse rounded bg-dark-700" />
                <div className="h-4 flex-1 animate-pulse rounded bg-dark-700" />
                <div className="h-4 w-24 animate-pulse rounded bg-dark-700" />
              </div>
            ))}
          </div>
        );
      case "text":
      default:
        return <div className="h-4 w-full animate-pulse rounded bg-dark-700" />;
    }
  };

  if (variant === "table") {
    return renderSkeleton();
  }

  return (
    <div className={variant === "card" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-2"} aria-busy="true" aria-label="Memuat konten">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
