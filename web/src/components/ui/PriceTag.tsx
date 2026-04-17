"use client";

interface PriceTagProps {
  price: number | null;
  originalPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
}

function formatPrice(price: number, currency: string): string {
  if (currency === "IDR") {
    return `Rp ${price.toLocaleString("id-ID")}`;
  }
  return `${currency} ${price.toLocaleString()}`;
}

function getDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function PriceTag({
  price,
  originalPrice,
  currency = "IDR",
  size = "md",
  showDiscount = true,
}: PriceTagProps) {
  if (!price) {
    return <span className="text-dark-400">Harga tidak tersedia</span>;
  }

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? getDiscount(price, originalPrice) : 0;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-bold text-white ${sizeClasses[size]}`}
        aria-label={`Harga ${formatPrice(price, currency)}`}
      >
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && showDiscount && (
        <>
          <span className="text-sm text-dark-400 line-through">
            {formatPrice(originalPrice, currency)}
          </span>
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
