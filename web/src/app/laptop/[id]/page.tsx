import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getJurusanMatch } from "@/lib/jurusan-match";
import { ShareButton } from "@/components/ShareButton";

interface Spec {
  label: string;
  value: string | number | null;
  icon: string;
  highlight?: boolean;
}

function formatPrice(price: number | null): string {
  if (!price) return "N/A";
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function getCheapest(prices: { label: string; price: number | null }[]) {
  const valid = prices.filter((p) => p.price && p.price > 0);
  if (!valid.length) return null;
  return valid.reduce((a, b) => ((a.price || 0) < (b.price || 0) ? a : b));
}

export default async function LaptopDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: laptop, error } = await supabase
    .from("laptops")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !laptop) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🔍</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Laptop tidak ditemukan</h1>
        <Link href="/search" className="text-primary-400 hover:text-primary-300">← Kembali ke pencarian</Link>
      </div>
    );
  }

  const prices = [
    { label: "Tokopedia", price: laptop.price_tokopedia, url: laptop.source_url },
    { label: "Shopee", price: laptop.price_shopee, url: laptop.source_url },
    { label: "Official", price: laptop.price_official, url: laptop.source_url },
  ];
  const cheapest = getCheapest(prices);

  // Calculate max price for visual bar
  const maxPrice = Math.max(
    ...prices.map(p => p.price || 0).filter(p => p > 0)
  );

  // Separate highlight specs and regular specs
  const allSpecs: Spec[] = [
    { label: "Processor", value: laptop.cpu_model, icon: "🔲", highlight: true },
    { label: "RAM", value: laptop.ram_gb ? `${laptop.ram_gb}GB ${laptop.ram_type || ""}` : null, icon: "💾", highlight: true },
    { label: "GPU", value: laptop.gpu_model, icon: "🎮", highlight: true },
    { label: "CPU Benchmark", value: laptop.cpu_benchmark, icon: "📊" },
    { label: "Storage", value: laptop.storage_gb ? `${laptop.storage_gb}GB ${laptop.storage_type || ""}` : null, icon: "💿" },
    { label: "Tipe GPU", value: laptop.gpu_type === "dedicated" ? "Dedicated" : laptop.gpu_type === "integrated" ? "Integrated" : null, icon: "⚡" },
    { label: "Layar", value: laptop.screen_inches ? `${laptop.screen_inches} inch` : null, icon: "📐" },
    { label: "Berat", value: laptop.weight_kg ? `${laptop.weight_kg} kg` : null, icon: "⚖️" },
    { label: "OS", value: laptop.os, icon: "🖥️" },
  ].filter((s) => s.value);

  const highlightSpecs = allSpecs.filter((s) => s.highlight);
  const regularSpecs = allSpecs.filter((s) => !s.highlight);

  const jurusanMatch = getJurusanMatch(laptop.ram_gb || 0, laptop.gpu_type);

  // Get page URL for sharing
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://kulpik.vercel.app"}/laptop/${id}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 lg:pb-8">
      {/* Back Button */}
      <Link href="/search" className="mb-4 inline-flex items-center gap-2 text-sm text-dark-300 transition-colors hover:text-white">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke pencarian
      </Link>

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-dark-400 hover:text-white transition-colors">Home</Link>
        <span className="text-dark-600">/</span>
        <Link href="/search" className="text-dark-400 hover:text-white transition-colors">Laptop</Link>
        <span className="text-dark-600">/</span>
        <Link href="/search" className="text-dark-400 hover:text-white transition-colors">{laptop.brand}</Link>
        <span className="text-dark-600">/</span>
        <span className="text-white font-medium truncate max-w-[200px]">{laptop.full_name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left — Image + Specs */}
        <div className="lg:col-span-3">
          {/* Image placeholder */}
          <div className="mb-6 flex h-64 items-center justify-center rounded-2xl border border-dark-600 bg-gradient-to-br from-dark-800 to-dark-700 sm:h-80">
            <span className="text-5xl font-black text-dark-500">{laptop.brand}</span>
          </div>

          {/* Title with Share Button */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary-600/20 px-3 py-0.5 text-xs font-semibold text-primary-400">{laptop.brand}</span>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{laptop.full_name}</h1>
              {laptop.model && <p className="mt-1 text-sm text-dark-300">Model: {laptop.model}</p>}
            </div>
            <ShareButton url={pageUrl} />
          </div>

          {/* Spec Highlights - CPU, RAM, GPU */}
          {highlightSpecs.length > 0 && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {highlightSpecs.map((s) => (
                <div key={s.label} className="rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-600/10 to-dark-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-xs font-medium text-dark-400 uppercase tracking-wide">{s.label}</span>
                  </div>
                  <p className="text-lg font-bold text-white leading-tight">{String(s.value)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Regular Specs Table */}
          <div className="rounded-2xl border border-dark-600 bg-dark-800">
            <div className="border-b border-dark-600 px-5 py-4">
              <h2 className="text-lg font-bold text-white">Spesifikasi Lengkap</h2>
            </div>
            <div className="divide-y divide-dark-700">
              {regularSpecs.map((s) => (
                <div key={s.label} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="text-lg opacity-60">{s.icon}</span>
                  <span className="w-32 text-sm font-medium text-dark-300">{s.label}</span>
                  <span className="text-sm font-semibold text-white">{String(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Price + Match */}
        <div className="lg:col-span-2">
          {/* Price Compare with Visual Bar */}
          <div className="mb-6 rounded-2xl border border-dark-600 bg-dark-800">
            <div className="border-b border-dark-600 px-5 py-4">
              <h2 className="text-lg font-bold text-white">Harga</h2>
            </div>
            <div className="divide-y divide-dark-700">
              {prices.map((p) => {
                const priceValue = p.price || 0;
                const percentage = maxPrice > 0 ? (priceValue / maxPrice) * 100 : 0;
                const isCheapest = cheapest?.label === p.label;
                
                return (
                  <div key={p.label} className={`px-5 py-4 ${isCheapest ? "bg-green-500/10" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-dark-200">{p.label}</span>
                        {isCheapest && (
                          <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">TERENDAH</span>
                        )}
                      </div>
                      <span className={`font-bold ${isCheapest ? "text-green-400" : "text-white"}`}>
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    {/* Visual Price Bar */}
                    {priceValue > 0 && (
                      <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isCheapest ? "bg-green-500" : "bg-primary-600"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {laptop.source_url && (
              <div className="p-4">
                <a
                  href={laptop.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-primary-600 py-3 text-center font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25"
                >
                  Beli Sekarang →
                </a>
              </div>
            )}
          </div>

          {/* Jurusan Match */}
          <div className="mb-6 rounded-2xl border border-dark-600 bg-dark-800 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Cocok untuk Jurusan</h2>
            <div className="space-y-3">
              {jurusanMatch.map((j) => (
                <div key={j.slug} className="flex items-center gap-3">
                  <span className={j.fit ? "text-green-400" : "text-red-400"}>{j.fit ? "✅" : "❌"}</span>
                  <Link
                    href={`/jurusan/${j.slug}`}
                    className={`text-sm transition-colors ${j.fit ? "font-medium text-white hover:text-primary-400" : "text-dark-400"}`}
                  >
                    {j.name}
                  </Link>
                  {!j.fit && j.needGpu && <span className="text-[10px] text-dark-500">(butuh GPU dedicated)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Source URL */}
          {laptop.source_url && (
            <div className="rounded-2xl border border-dark-600 bg-dark-800 p-5">
              <h2 className="mb-2 text-sm font-bold text-white">Sumber Data</h2>
              <a
                href={laptop.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-xs text-primary-400 hover:text-primary-300"
              >
                {laptop.source_url}
              </a>
              <p className="mt-2 text-[10px] text-dark-400">
                Terakhir diupdate: {laptop.updated_at ? new Date(laptop.updated_at).toLocaleDateString("id-ID") : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Buy Button for Mobile */}
      {laptop.source_url && (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-sm border-t border-dark-700 p-4 lg:hidden z-50">
          <a
            href={laptop.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-primary-600 py-4 text-center font-bold text-white shadow-xl shadow-primary-600/30 transition-all hover:bg-primary-700"
          >
            Beli Sekarang →
          </a>
        </div>
      )}
    </div>
  );
}