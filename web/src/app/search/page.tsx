"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LaptopCard from "@/components/laptop/LaptopCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterChip from "@/components/ui/FilterChip";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";

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

const BRANDS = ["ASUS", "Lenovo", "HP", "Acer", "Apple", "Dell", "MSI"];
const RAM_OPTIONS = [8, 16, 32];
const GPU_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "integrated", label: "Integrated" },
  { value: "dedicated", label: "Dedicated" },
];
const STORAGE_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "SSD", label: "SSD" },
  { value: "HDD", label: "HDD" },
];
const SCREEN_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "small", label: '13-14"' },
  { value: "medium", label: '15-16"' },
  { value: "large", label: '17"+' },
];
const WEIGHT_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "light", label: "<1.5kg" },
  { value: "medium", label: "1.5-2kg" },
  { value: "heavy", label: ">2kg" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [budgetMin, setBudgetMin] = useState(Number(searchParams.get("budget_min")) || 3);
  const [budgetMax, setBudgetMax] = useState(Number(searchParams.get("budget_max")) || 25);
  const [minRam, setMinRam] = useState(Number(searchParams.get("ram")) || 0);
  const [gpuType, setGpuType] = useState(searchParams.get("gpu") || "");
  const [storageType, setStorageType] = useState(searchParams.get("storage") || "");
  const [screenSize, setScreenSize] = useState(searchParams.get("screen") || "");
  const [weightRange, setWeightRange] = useState(searchParams.get("weight") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "price_asc");
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const suggestionsTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (suggestionsTimer.current) clearTimeout(suggestionsTimer.current);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    suggestionsTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setSuggestions(data.suggestions || []);
      } catch {}
    }, 300);
    return () => {
      if (suggestionsTimer.current) clearTimeout(suggestionsTimer.current);
    };
  }, [query]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (brand) params.set("brand", brand);
    if (budgetMin !== 3) params.set("budget_min", String(budgetMin));
    if (budgetMax !== 25) params.set("budget_max", String(budgetMax));
    if (minRam) params.set("ram", String(minRam));
    if (gpuType) params.set("gpu", gpuType);
    if (storageType) params.set("storage", storageType);
    if (screenSize) params.set("screen", screenSize);
    if (weightRange) params.set("weight", weightRange);
    if (sort !== "price_asc") params.set("sort", sort);

    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, brand, budgetMin, budgetMax, minRam, gpuType, storageType, screenSize, weightRange, sort, router]);

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
      if (minRam > 0) results = results.filter((l: Laptop) => (l.ram_gb || 0) >= minRam);
      if (gpuType) results = results.filter((l: Laptop) => l.gpu_type === gpuType);
      if (storageType) results = results.filter((l: Laptop) => (l.storage_type || "").toUpperCase().includes(storageType));
      if (screenSize) {
        results = results.filter((l: Laptop) => {
          const s = l.screen_inches || 0;
          if (screenSize === "small") return s >= 13 && s <= 14;
          if (screenSize === "medium") return s >= 15 && s <= 16;
          if (screenSize === "large") return s >= 17;
          return true;
        });
      }
      if (weightRange) {
        results = results.filter((l: Laptop) => {
          const w = l.weight_kg || 0;
          if (weightRange === "light") return w > 0 && w < 1.5;
          if (weightRange === "medium") return w >= 1.5 && w <= 2;
          if (weightRange === "heavy") return w > 2;
          return true;
        });
      }

      // Sort
      if (sort === "price_asc") results.sort((a: Laptop, b: Laptop) => (a.price_tokopedia || 0) - (b.price_tokopedia || 0));
      if (sort === "price_desc") results.sort((a: Laptop, b: Laptop) => (b.price_tokopedia || 0) - (a.price_tokopedia || 0));
      if (sort === "name") results.sort((a: Laptop, b: Laptop) => (a.full_name || "").localeCompare(b.full_name || ""));
      if (sort === "lightest") results.sort((a: Laptop, b: Laptop) => (a.weight_kg || 999) - (b.weight_kg || 999));
      if (sort === "best_value") {
        results.sort((a: Laptop, b: Laptop) => {
          const valA = (a.ram_gb || 1) / ((a.price_tokopedia || 1) / 1_000_000);
          const valB = (b.ram_gb || 1) / ((b.price_tokopedia || 1) / 1_000_000);
          return valB - valA;
        });
      }

      setLaptops(results);
    } catch (e) {
      console.error("Search failed:", e);
    }
    setLoading(false);
  }, [query, brand, budgetMin, budgetMax, minRam, gpuType, storageType, screenSize, weightRange, sort]);

  useEffect(() => {
    const t = setTimeout(search, 400);
    return () => clearTimeout(t);
  }, [search]);

  const activeFilters = [
    brand && `Brand: ${brand}`,
    minRam > 0 && `RAM: ${minRam}GB+`,
    gpuType && `GPU: ${gpuType}`,
    storageType && `Storage: ${storageType}`,
    screenSize && `Layar: ${SCREEN_OPTIONS.find(s => s.value === screenSize)?.label}`,
    weightRange && `Berat: ${WEIGHT_OPTIONS.find(w => w.value === weightRange)?.label}`,
  ].filter(Boolean) as string[];

  const clearFilter = (f: string) => {
    if (f.startsWith("Brand")) setBrand("");
    if (f.startsWith("RAM")) setMinRam(0);
    if (f.startsWith("GPU")) setGpuType("");
    if (f.startsWith("Storage")) setStorageType("");
    if (f.startsWith("Layar")) setScreenSize("");
    if (f.startsWith("Berat")) setWeightRange("");
  };

  const clearAllFilters = () => {
    setBrand("");
    setMinRam(0);
    setGpuType("");
    setStorageType("");
    setScreenSize("");
    setWeightRange("");
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
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={search}
                placeholder="Nama, CPU, GPU..."
                suggestions={suggestions}
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

            {/* Storage Type */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Storage</label>
              <div className="flex gap-2">
                {STORAGE_OPTIONS.map((s) => (
                  <button key={s.value} onClick={() => setStorageType(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${storageType === s.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Screen Size */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Ukuran Layar</label>
              <div className="flex gap-2">
                {SCREEN_OPTIONS.map((s) => (
                  <button key={s.value} onClick={() => setScreenSize(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${screenSize === s.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Berat</label>
              <div className="flex gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button key={w.value} onClick={() => setWeightRange(w.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${weightRange === w.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{w.label}</button>
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
              <span aria-hidden="true">🔽</span> Filter {activeFilters.length > 0 && <span className="rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] text-white">{activeFilters.length}</span>}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none">
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="name">Nama A-Z</option>
              <option value="lightest">Paling Ringan</option>
              <option value="best_value">Best Value</option>
            </select>
            <span className="ml-auto text-sm text-gray-500">{laptops.length} laptop</span>
          </div>

          {/* Mobile Filters Accordion */}
          {showFilters && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">
              <div className="mb-3">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSubmit={search}
                  placeholder="Cari laptop..."
                  suggestions={suggestions}
                />
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
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">GPU</p>
                <div className="flex gap-2">
                  {GPU_OPTIONS.map((g) => <button key={g.value} onClick={() => setGpuType(g.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${gpuType === g.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{g.label}</button>)}
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">Storage</p>
                <div className="flex gap-2">
                  {STORAGE_OPTIONS.map((s) => <button key={s.value} onClick={() => setStorageType(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${storageType === s.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{s.label}</button>)}
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold text-gray-700">Layar</p>
                <div className="flex gap-2">
                  {SCREEN_OPTIONS.map((s) => <button key={s.value} onClick={() => setScreenSize(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${screenSize === s.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{s.label}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-700">Berat</p>
                <div className="flex gap-2">
                  {WEIGHT_OPTIONS.map((w) => <button key={w.value} onClick={() => setWeightRange(w.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${weightRange === w.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}>{w.label}</button>)}
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <FilterChip key={f} label={f} onRemove={() => clearFilter(f)} />
              ))}
              <button onClick={clearAllFilters} className="rounded-full px-3 py-1 text-xs text-gray-400 hover:text-gray-600">
                Hapus semua
              </button>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : laptops.length === 0 ? (
            <ErrorState
              title="Tidak ada laptop ditemukan"
              message="Coba ubah filter atau kata kunci"
            />
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
