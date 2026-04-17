interface SkeletonProps {
  variant?: "card" | "text" | "circle" | "table";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "text",
  count = 1,
}: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="rounded-2xl h-80 bg-gray-100 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-14" />
              </div>
            </div>
          </div>
        );
      case "circle":
        return <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />;
      case "table":
        return (
          <div className="space-y-2">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex gap-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse flex-1" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
              </div>
            ))}
          </div>
        );
      case "text":
      default:
        return <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />;
    }
  };

  if (variant === "table") {
    return renderSkeleton();
  }

  return (
    <div className={variant === "card" ? "" : "space-y-2"} aria-busy="true" aria-label="Memuat konten">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}