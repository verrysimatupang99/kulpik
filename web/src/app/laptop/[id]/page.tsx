import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getJurusanMatch } from "@/lib/jurusan-match";

interface Spec {
  label: string;
  value: string | number | null;
  icon: string;
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
        <div className="mb-4 text-5xl" aria-hidden="true">🔍</div>
        <h1 className="mb-2 text-2xl font-bold">Laptop tidak ditemukan</h1>
        <Link href="/search" className="text-primary-600 hover:underline">← Kembali ke pencarian</Link>
      </div>
    );
  }

  const prices = [
    { label: "Tokopedia", price: laptop.price_tokopedia, url: laptop.source_url },
    { label: "Shopee", price: laptop.price_shopee, url: laptop.source_url },
    { label: "Official", price: laptop.price_official, url: laptop.source_url },
  ];
  const cheapest = getCheapest(prices);

  const specs: Spec[] = [
    { label: "Processor", value: laptop.cpu_model, icon: "🔲" },
    { label: "CPU Benchmark", value: laptop.cpu_benchmark, icon: "📊" },
    { label: "RAM", value: laptop.ram_gb ? `${laptop.ram_gb}GB ${laptop.ram_type || ""}` : null, icon: "💾" },
    { label: "Storage", value: laptop.storage_gb ? `${laptop.storage_gb}GB ${laptop.storage_type || ""}` : null, icon: "💿" },
    { label: "GPU", value: laptop.gpu_model, icon: "🎮" },
    { label: "Tipe GPU", value: laptop.gpu_type === "dedicated" ? "Dedicated" : laptop.gpu_type === "integrated" ? "Integrated" : null, icon: "⚡" },
    { label: "Layar", value: laptop.screen_inches ? `${laptop.screen_inches} inch` : null, icon: "📐" },
    { label: "Berat", value: laptop.weight_kg ? `${laptop.weight_kg} kg` : null, icon: "⚖️" },
    { label: "OS", value: laptop.os, icon: "🖥️" },
  ].filter((s) => s.value);

  const jurusanMatch = getJurusanMatch(laptop.ram_gb || 0, laptop.gpu_type);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/search" className="mb-6 inline-block text-sm text-primary-600 hover:underline">← Kembali ke pencarian</Link>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left — Image + Specs */}
        <div className="lg:col-span-3">
          {/* Image placeholder */}
          <div className="mb-6 flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 sm:h-80">
            <span className="text-5xl font-black text-gray-300">{laptop.brand}</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <span className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-0.5 text-xs font-semibold text-primary-700">{laptop.brand}</span>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{laptop.full_name}</h1>
            {laptop.model && <p className="mt-1 text-sm text-gray-500">Model: {laptop.model}</p>}
          </div>

          {/* Specs Table */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-3">
              <h2 className="text-lg font-bold text-gray-900">Spesifikasi</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-lg" aria-hidden="true">{s.icon}</span>
                  <span className="w-32 text-sm font-medium text-gray-500">{s.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{String(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Price + Match */}
        <div className="lg:col-span-2">
          {/* Price Compare */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-3">
              <h2 className="text-lg font-bold text-gray-900">Harga</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {prices.map((p) => (
                <div key={p.label} className={`flex items-center justify-between px-5 py-3 ${cheapest?.label === p.label ? "bg-green-50" : ""}`}>
                  <div>
                    <span className="text-sm font-medium text-gray-600">{p.label}</span>
                    {cheapest?.label === p.label && (
                      <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">TERENDAH</span>
                    )}
                  </div>
                  <span className={`font-bold ${cheapest?.label === p.label ? "text-green-700" : "text-gray-900"}`}>
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
            </div>
            {laptop.source_url && (
              <div className="p-4">
                <a href={laptop.source_url} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-primary-600 py-3 text-center font-bold text-white transition-colors hover:bg-primary-700">
                  Beli Sekarang →
                </a>
              </div>
            )}
          </div>

          {/* Jurusan Match */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Cocok untuk Jurusan</h2>
            <div className="space-y-2">
              {jurusanMatch.map((j) => (
                <div key={j.name} className="flex items-center gap-2">
                  <span className={j.fit ? "text-green-500" : "text-red-400"}>{j.fit ? "✅" : "❌"}</span>
                  <Link href={`/jurusan/${j.slug}`} className={`text-sm ${j.fit ? "font-medium text-gray-900 hover:text-primary-600" : "text-gray-400"}`}>
                    {j.name}
                  </Link>
                  {!j.fit && <span className="text-[10px] text-gray-400">(butuh GPU dedicated)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Source URL */}
          {laptop.source_url && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="mb-2 text-sm font-bold text-gray-900">Sumber Data</h2>
              <a href={laptop.source_url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-primary-600 hover:underline">
                {laptop.source_url}
              </a>
              <p className="mt-2 text-[10px] text-gray-400">
                Terakhir diupdate: {laptop.updated_at ? new Date(laptop.updated_at).toLocaleDateString("id-ID") : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
