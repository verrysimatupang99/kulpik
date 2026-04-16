"use client";

import { useState, useEffect, useCallback } from "react";
import LaptopCard from "@/components/laptop/LaptopCard";

const BRANDS = ["ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"];
const RAM_OPTIONS = [8, 16, 32];
const GPU_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "integrated", label: "Integrated" },
  { value: "dedicated", label: "Dedicated" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [budgetMin, setBudgetMin] = useState(3);
  const [budgetMax, setBudgetMax] = useState(25);
  const [minRam, setMinRam] = useState(0);
  const [gpuType, setGpuType] = useState("");
  const [sort, setSort] = useState("price_asc");
  const [laptops, setLaptops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (brand) params.set("brand", brand);
      params.set("budget_min", String(budgetMin * 1_000_000));
      params.set("budget_max", String(budgetMax * 1_000_000));
      params.set("limit", "50");

      const res = await fetch(`/api/recommend?${params}`);
      const data = await res.json();
      let results = data.laptops || [];

      // Client-side filters
      if (minRam > 0) results = results.filter((l: any) => (l.ram_gb || 0) >= minRam);
      if (gpuType) results = results.filter((l: any) => l.gpu_type === gpuType);

      // Sort
      if (sort === "price_asc") results.sort((a: any, b: any) => (a.price_tokopedia || 0) - (b.price_tokopedia || 0));
      if (sort === "price_desc") results.sort((a: any, b: any) => (b.price_tokopedia || 0) - (a.price_tokopedia || 0));
      if (sort === "name") results.sort((a: any, b: any) => (a.full_name || "").localeCompare(b.full_name || ""));

      setLaptops(results);
    } catch (e) {
      console.error("Search failed:", e);
    }
    setLoading(false);
  }, [query, brand, budgetMin, budgetMax, minRam, gpuType, sort]);

  useEffect(() => {
    const t = setTimeout(search, 400);
    return () => clearTimeout(t);
  }, [search]);

  const activeFilters = [
    brand && `Brand: ${brand}`,
    minRam > 0 && `RAM: ${minRam}GB+`,
    gpuType && `GPU: ${gpuType}`,
  ].filter(Boolean) as string[];

  const clearFilter = (f: string) => {
    if (f.startsWith("Brand")) setBrand("");
    if (f.startsWith("RAM")) setMinRam(0);
    if (f.startsWith("GPU")) setGpuType("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Cari Laptop</h1>
        <p className="mt-1 text-sm text-gray-500">Filter berdasarkan brand, budget, dan kebutuhan</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-gray-200 bg-white p-5">
            {/* Search */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Cari</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nama, CPU, GPU..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Brand</label>
              <div className="space-y-1.5">
                {BRANDS.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <input
                      type="radio"
                      name="brand"
                      checked={brand === b}
                      onChange={() => setBrand(brand === b ? "" : b)}
                      className="accent-primary-600"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Budget: {budgetMin} — {budgetMax} juta
              </label>
              <div className="flex gap-2">
                <input type="range" min={3} max={35} value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="flex-1 accent-primary-600" />
                <input type="range" min={5} max={40} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="flex-1 accent-primary-600" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Rp 3jt</span><span>Rp 40jt</span>
              </div>
            </div>

            {/* RAM */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">RAM Minimum</label>
              <div className="flex gap-2">
                <button onClick={() => setMinRam(0)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${minRam === 0 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Semua</button>
                {RAM_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setMinRam(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${minRam === r ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r}GB+</button>
                ))}
              </div>
            </div>

            {/* GPU */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">GPU</label>
              <div className="flex gap-2">
                {GPU_OPTIONS.map((g) => (
                  <button key={g.value} onClick={() => setGpuType(g.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${gpuType === g.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{g.label}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle + Sort */}
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 lg:hidden">
              🔽 Filter {activeFilters.length > 0 && <span className="rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] text-white">{activeFilters.length}</span>}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none">
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="name">Nama A-Z</option>
            </select>
            <span className="ml-auto text-sm text-gray-500">{laptops.length} laptop</span>
          </div>

          {/* Mobile Filters Accordion */}
          {showFilters && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">
              <div className="mb-3">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari laptop..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none" />
              </div>
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button key={b} onClick={() => setBrand(brand === b ? "" : b)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${brand === b ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">Budget: {budgetMin}-{budgetMax} juta</p>
                <input type="range" min={3} max={35} value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="w-full accent-primary-600" />
                <input type="range" min={5} max={40} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="w-full accent-primary-600" />
              </div>
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">RAM</p>
                <div className="flex gap-2">
                  <button onClick={() => setMinRam(0)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${minRam === 0 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>Semua</button>
                  {RAM_OPTIONS.map((r) => <button key={r} onClick={() => setMinRam(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${minRam === r ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{r}GB+</button>)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700">GPU</p>
                <div className="flex gap-2">
                  {GPU_OPTIONS.map((g) => <button key={g.value} onClick={() => setGpuType(g.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${gpuType === g.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{g.label}</button>)}
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <button key={f} onClick={() => clearFilter(f)} className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {f} <span className="ml-0.5 text-primary-400">×</span>
                </button>
              ))}
              <button onClick={() => { setBrand(""); setMinRam(0); setGpuType(""); }} className="rounded-full px-3 py-1 text-xs text-gray-400 hover:text-gray-600">
                Hapus semua
              </button>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : laptops.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-3 text-5xl">😢</div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">Tidak ada laptop ditemukan</h3>
              <p className="text-sm text-gray-500">Coba ubah filter atau kata kunci</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {laptops.map((l) => (
                <LaptopCard key={l.id} laptop={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
