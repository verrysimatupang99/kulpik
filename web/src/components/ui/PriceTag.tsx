"use client";

interface PriceTagProps {
  price: number | null;
  originalPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

export default function PriceTag({
  price,
  originalPrice,
  currency = "Rp",
  size = "md",
  showDiscount = true,
}: PriceTagProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const formatPrice = (value: number | null | undefined): string => {
    if (!value) return "N/A";
    return `${currency} ${value.toLocaleString("id-ID")}`;
  };

  const hasDiscount = originalPrice && price && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  if (!price) {
    return (
      <span className={`font-semibold text-gray-400 ${sizeClasses[size]}`}>
        N/A
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`font-extrabold text-primary-600 ${sizeClasses[size]}`} aria-label={`Harga ${formatPrice(price)}`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && showDiscount && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            -{discountPercentage}%
          </span>
        </div>
      )}
    </div>
  );
}