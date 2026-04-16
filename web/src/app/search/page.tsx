"use client";

import { useState, useEffect, useCallback } from "react";

interface Laptop {
  id: string;
  full_name: string;
  brand: string;
  price_tokopedia: number | null;
  cpu_model: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  gpu_model: string | null;
  screen_inches: number | null;
  source_url: string | null;
}

const BRANDS = ["ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [budgetMax, setBudgetMax] = useState(20);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (brand) params.set("brand", brand);
      params.set("budget_max", String(budgetMax * 1_000_000));
      params.set("limit", "20");

      const res = await fetch(`/api/recommend?${params}`);
      const data = await res.json();
      if (data.success) setLaptops(data.laptops || []);
    } catch (e) {
      console.error("Search failed:", e);
    }
    setLoading(false);
  }, [query, brand, budgetMax]);

  useEffect(() => {
    const t = setTimeout(search, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fmtPrice = (p: number | null) =>
    p ? `Rp ${p.toLocaleString("id-ID")}` : "N/A";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Cari Laptop</h1>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Cari</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nama laptop, CPU, brand..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 outline-none"
            >
              <option value="">Semua Brand</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Budget Maksimal: {budgetMax} juta
            </label>
            <input
              type="range"
              min={3}
              max={40}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>3 juta</span>
              <span>40 juta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="mb-2 text-3xl">🔍</div>
          Mencari laptop...
        </div>
      ) : laptops.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <div className="mb-2 text-3xl">😢</div>
          Tidak ada laptop ditemukan. Coba ubah filter.
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">{laptops.length} laptop ditemukan</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {laptops.map((l) => (
              <a
                key={l.id}
                href={l.source_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                    {l.brand}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2">
                  {l.full_name}
                </h3>
                <p className="mb-3 text-lg font-bold text-primary-600">
                  {fmtPrice(l.price_tokopedia)}
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  {l.cpu_model && <span>🔲 {l.cpu_model}</span>}
                  {l.ram_gb && <span>💾 {l.ram_gb}GB RAM</span>}
                  {l.storage_gb && <span>💿 {l.storage_gb}GB</span>}
                  {l.gpu_model && <span>🎮 {l.gpu_model}</span>}
                  {l.screen_inches && <span>📐 {l.screen_inches}"</span>}
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
