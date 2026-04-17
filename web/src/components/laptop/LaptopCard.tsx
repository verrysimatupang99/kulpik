import Link from "next/link";

const BRAND_COLORS: Record<string, string> = {
  ASUS: "from-blue-600 to-blue-800",
  Lenovo: "from-red-600 to-red-800",
  HP: "from-slate-600 to-slate-800",
  Acer: "from-green-600 to-green-800",
  Apple: "from-gray-700 to-gray-900",
  Dell: "from-blue-700 to-blue-900",
  MSI: "from-red-700 to-orange-800",
};

const BRAND_LOGOS: Record<string, string> = {
  ASUS: "ASUS",
  Lenovo: "Lenovo",
  HP: "HP",
  Acer: "Acer",
  Apple: "",
  Dell: "Dell",
  MSI: "MSI",
};

function formatPrice(price: number | null): string {
  if (!price) return "N/A";
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function getCheapest(l: Laptop): { price: number; source: string } {
  const prices = [
    { price: l.price_tokopedia, source: "Tokopedia" },
    { price: l.price_shopee, source: "Shopee" },
    { price: l.price_official, source: "Official" },
  ].filter((p) => p.price && p.price > 0);
  if (!prices.length) return { price: 0, source: "" };
  prices.sort((a, b) => (a.price || 0) - (b.price || 0));
  return prices[0] as { price: number; source: string };
}

function getJurusanMatch(l: Laptop): string[] {
  const matches: string[] = [];
  const ram = l.ram_gb || 0;
  const gpu = l.gpu_type;
  if (ram >= 16) matches.push("TI");
  if (ram >= 16 && gpu === "dedicated") matches.push("DKV");
  if (ram >= 8) matches.push("Manajemen");
  if (ram >= 8) matches.push("Kedokteran");
  if (gpu === "dedicated") matches.push("Arsitektur");
  if (ram >= 16 && gpu === "dedicated") matches.push("Teknik Mesin");
  return matches.slice(0, 3);
}

interface Laptop {
  id: string;
  full_name: string;
  brand: string;
  price_tokopedia: number | null;
  price_shopee: number | null;
  price_official: number | null;
  cpu_model: string | null;
  ram_gb: number | null;
  ram_type: string | null;
  storage_gb: number | null;
  storage_type: string | null;
  gpu_model: string | null;
  gpu_type: string | null;
  screen_inches: number | null;
  weight_kg: number | null;
  source_url: string | null;
}

export default function LaptopCard({ laptop }: { laptop: Laptop }) {
  const cheapest = getCheapest(laptop);
  const matches = getJurusanMatch(laptop);
  const brandColor = BRAND_COLORS[laptop.brand] || "from-gray-600 to-gray-800";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-primary-300 hover:shadow-lg">
      {/* Image / Brand Placeholder */}
      <div
        className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${brandColor} sm:h-44`}
      >
        <span className="text-3xl font-black tracking-wider text-white/30 sm:text-4xl">
          {BRAND_LOGOS[laptop.brand] || laptop.brand}
        </span>
        {matches.length > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-primary-700 shadow-sm">
            Cocok {matches[0]}
          </span>
        )}
        {cheapest.source === "Shopee" && (
          <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            Harga Shopee
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand + Name */}
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {laptop.brand}
        </span>
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-primary-700 sm:text-[15px]">
          {laptop.full_name || "Nama tidak tersedia"}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-extrabold text-primary-600">
            {formatPrice(cheapest.price)}
          </p>
          {laptop.price_shopee && laptop.price_tokopedia && laptop.price_shopee < laptop.price_tokopedia && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(laptop.price_tokopedia)}
            </p>
          )}
        </div>

        {/* Spec Pills */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {laptop.cpu_model && (
            <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {laptop.cpu_model.split(" ").slice(-2).join(" ")}
            </span>
          )}
          {laptop.ram_gb && (
            <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
              {laptop.ram_gb}GB {laptop.ram_type || ""}
            </span>
          )}
          {laptop.storage_gb && (
            <span className="rounded-lg bg-green-50 px-2 py-0.5 text-[11px] text-green-700">
              {laptop.storage_gb}GB {laptop.storage_type || ""}
            </span>
          )}
          {laptop.gpu_type === "dedicated" && (
            <span className="rounded-lg bg-purple-50 px-2 py-0.5 text-[11px] text-purple-700">
              GPU Dedicated
            </span>
          )}
          {laptop.screen_inches && (
            <span className="rounded-lg bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700">
              {laptop.screen_inches}"
            </span>
          )}
        </div>

        {/* Jurusan Matches */}
        {matches.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-[10px] font-medium text-gray-400">Cocok untuk:</p>
            <div className="flex flex-wrap gap-1">
              {matches.map((m) => (
                <span key={m} className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="flex gap-2">
          <Link
            href={`/laptop/${laptop.id}`}
            className="flex-1 rounded-xl bg-primary-600 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Lihat Detail
          </Link>
          <button className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-500 transition-colors hover:border-primary-300 hover:text-primary-600">
            ⚖️
          </button>
        </div>
      </div>
    </div>
  );
}
