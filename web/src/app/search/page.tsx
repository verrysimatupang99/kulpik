"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ErrorBoundary } from "@/components/ui";
import { Suspense } from "react";
import LaptopCard from "@/components/laptop/LaptopCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterChip from "@/components/ui/FilterChip";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";

// Suggested searches for empty state
const SUGGESTED_SEARCHES = [
  "Laptop 10 juta terbaik",
  "Laptop untuk desain grafis",
  "Laptop ringan mahasiswa",
];

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

function SearchContent() {
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
  const [resultsKey, setResultsKey] = useState(0);

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
      // Search failed silently
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
    <div className="min-h-screen bg-surface-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-edge/50 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Cari <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Laptop</span>
            </h1>
            <p className="mt-2 text-ink-subtle">Filter berdasarkan brand, budget, dan kebutuhan</p>
          </div>

          {/* Quick Search */}
          <div className="mx-auto max-w-2xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={search}
              placeholder="Cari laptop... (misal: ASUS VivoBook, laptop 10 juta)"
              suggestions={suggestions}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-edge bg-surface p-6">
              {/* Brand */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Brand</label>
                <div className="space-y-2">
                  {BRANDS.map((b) => (
                    <label key={b} className="flex cursor-pointer items-center gap-3 text-sm text-ink-subtle hover:text-white">
                      <input
                        type="radio"
                        name="brand"
                        checked={brand === b}
                        onChange={() => setBrand(brand === b ? "" : b)}
                        className="accent-primary-500"
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Budget: {budgetMin} — {budgetMax} juta
                </label>
                <div className="flex gap-3">
                  <input type="range" min={3} max={35} value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="flex-1 accent-primary-500" />
                  <input type="range" min={5} max={40} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="flex-1 accent-primary-500" />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-ink-faint">
                  <span>Rp 3jt</span><span>Rp 40jt</span>
                </div>
              </div>

              {/* RAM */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">RAM Minimum</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setMinRam(0)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${minRam === 0 ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>Semua</button>
                  {RAM_OPTIONS.map((r) => (
                    <button key={r} onClick={() => setMinRam(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${minRam === r ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>{r}GB+</button>
                  ))}
                </div>
              </div>

              {/* GPU */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">GPU</label>
                <div className="flex flex-wrap gap-2">
                  {GPU_OPTIONS.map((g) => (
                    <button key={g.value} onClick={() => setGpuType(g.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${gpuType === g.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>{g.label}</button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Storage</label>
                <div className="flex flex-wrap gap-2">
                  {STORAGE_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setStorageType(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${storageType === s.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>{s.label}</button>
                  ))}
                </div>
              </div>

              {/* Screen Size */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Ukuran Layar</label>
                <div className="flex flex-wrap gap-2">
                  {SCREEN_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setScreenSize(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${screenSize === s.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>{s.label}</button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Berat</label>
                <div className="flex flex-wrap gap-2">
                  {WEIGHT_OPTIONS.map((w) => (
                    <button key={w.value} onClick={() => setWeightRange(w.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${weightRange === w.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle hover:bg-dark-600"}`}>{w.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle + Sort */}
            <div className="mb-6 flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm font-medium text-ink-subtle hover:bg-surface-raised lg:hidden">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {activeFilters.length > 0 && <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] text-white">{activeFilters.length}</span>}
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-ink-subtle outline-none focus:border-primary-500">
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="name">Nama A-Z</option>
                <option value="lightest">Paling Ringan</option>
                <option value="best_value">Best Value</option>
              </select>
              <span className="ml-auto text-sm text-ink-muted">{laptops.length} laptop</span>
            </div>

            {/* Mobile Filters Accordion */}
            {showFilters && (
              <div className="mb-6 rounded-2xl border border-edge bg-surface p-5 lg:hidden">
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Brand</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((b) => (
                      <button key={b} onClick={() => setBrand(brand === b ? "" : b)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${brand === b ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{b}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Budget: {budgetMin}-{budgetMax} juta</p>
                  <input type="range" min={3} max={35} value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="w-full accent-primary-500" />
                  <input type="range" min={5} max={40} value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="w-full accent-primary-500" />
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">RAM</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setMinRam(0)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${minRam === 0 ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>Semua</button>
                    {RAM_OPTIONS.map((r) => <button key={r} onClick={() => setMinRam(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${minRam === r ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{r}GB+</button>)}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">GPU</p>
                  <div className="flex flex-wrap gap-2">
                    {GPU_OPTIONS.map((g) => <button key={g.value} onClick={() => setGpuType(g.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${gpuType === g.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{g.label}</button>)}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Storage</p>
                  <div className="flex flex-wrap gap-2">
                    {STORAGE_OPTIONS.map((s) => <button key={s.value} onClick={() => setStorageType(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${storageType === s.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{s.label}</button>)}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Layar</p>
                  <div className="flex flex-wrap gap-2">
                    {SCREEN_OPTIONS.map((s) => <button key={s.value} onClick={() => setScreenSize(s.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${screenSize === s.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{s.label}</button>)}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Berat</p>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHT_OPTIONS.map((w) => <button key={w.value} onClick={() => setWeightRange(w.value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${weightRange === w.value ? "bg-primary-600 text-white" : "bg-surface-raised text-ink-subtle"}`}>{w.label}</button>)}
                  </div>
                </div>
              </div>
            )}

            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeFilters.map((f) => (
                  <FilterChip key={f} label={f} onRemove={() => clearFilter(f)} />
                ))}
                <button onClick={clearAllFilters} className="rounded-full px-3 py-1 text-xs text-ink-faint hover:text-white">
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
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {laptops.map((l) => (
                  <LaptopCard key={l.id} laptop={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ErrorBoundary>
      <SearchContent />
    </ErrorBoundary>
  );
}