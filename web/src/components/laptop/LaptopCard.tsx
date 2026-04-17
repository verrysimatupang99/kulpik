import Link from "next/link";

const BRAND_COLORS: Record<string, string> = {
  ASUS: "from-blue-600/30 to-blue-800/30",
  Lenovo: "from-red-600/30 to-red-800/30",
  HP: "from-slate-600/30 to-slate-800/30",
  Acer: "from-green-600/30 to-green-800/30",
  Apple: "from-gray-700/30 to-gray-900/30",
  Dell: "from-blue-700/30 to-blue-900/30",
  MSI: "from-red-700/30 to-orange-800/30",
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
  const brandColor = BRAND_COLORS[laptop.brand] || "from-gray-600/30 to-gray-800/30";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-dark-600 bg-dark-800 transition-all duration-200 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-600/5">
      {/* Image / Brand Placeholder */}
      <div
        className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${brandColor} sm:h-44`}
      >
        <span className="text-3xl font-black tracking-wider text-white/20 sm:text-4xl">
          {BRAND_LOGOS[laptop.brand] || laptop.brand}
        </span>
        {matches.length > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-primary-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-lg">
            Cocok {matches[0]}
          </span>
        )}
        {cheapest.source === "Shopee" && (
          <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-lg">
            Harga Shopee
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Brand + Name */}
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-dark-400">
          {laptop.brand}
        </span>
        <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-primary-400 sm:text-[15px]">
          {laptop.full_name || "Nama tidak tersedia"}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-extrabold text-primary-400">
            {formatPrice(cheapest.price)}
          </p>
          {laptop.price_shopee && laptop.price_tokopedia && laptop.price_shopee < laptop.price_tokopedia && (
            <p className="text-xs text-dark-400 line-through">
              {formatPrice(laptop.price_tokopedia)}
            </p>
          )}
        </div>

        {/* Spec Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {laptop.cpu_model && (
            <span className="rounded-lg bg-dark-700 px-2 py-0.5 text-[11px] text-dark-200">
              {laptop.cpu_model.split(" ").slice(-2).join(" ")}
            </span>
          )}
          {laptop.ram_gb && (
            <span className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-400">
              {laptop.ram_gb}GB {laptop.ram_type || ""}
            </span>
          )}
          {laptop.storage_gb && (
            <span className="rounded-lg bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400">
              {laptop.storage_gb}GB {laptop.storage_type || ""}
            </span>
          )}
          {laptop.gpu_type === "dedicated" && (
            <span className="rounded-lg bg-purple-500/10 px-2 py-0.5 text-[11px] text-purple-400">
              GPU Dedicated
            </span>
          )}
          {laptop.screen_inches && (
            <span className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-400">
              {laptop.screen_inches}"
            </span>
          )}
        </div>

        {/* Jurusan Matches */}
        {matches.length > 0 && (
          <div className="mb-4">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dark-400">Cocok untuk:</p>
            <div className="flex flex-wrap gap-1.5">
              {matches.map((m) => (
                <span key={m} className="rounded-full border border-primary-500/30 bg-primary-600/20 px-2.5 py-0.5 text-[10px] font-medium text-primary-300">
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
            className="flex-1 rounded-xl bg-primary-600 px-3 py-2.5 text-center text-xs font-semibold text-white transition-all hover:bg-primary-700"
          >
            Lihat Detail
          </Link>
          <button className="rounded-xl border border-dark-600 px-3 py-2.5 text-xs text-dark-300 transition-colors hover:border-primary-500/50 hover:text-primary-400">
            ⚖️
          </button>
        </div>
      </div>
    </div>
  );
}
