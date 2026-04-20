"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for comparison
const MOCK_LAPTOPS = [
  { id: 1, name: "ASUS VivoBook 15", brand: "ASUS", price: 12500000, ram: 16, storage: 512, cpu: "Intel Core i5-1235U", gpu: "Intel Iris Xe", weight: 1.7, screen: "15.6 FHD" },
  { id: 2, name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", price: 13999000, ram: 16, storage: 512, cpu: "AMD Ryzen 5 5625U", gpu: "AMD Radeon Graphics", weight: 1.66, screen: "15.6 FHD" },
  { id: 3, name: "HP 15s", brand: "HP", price: 11999000, ram: 8, storage: 512, cpu: "Intel Core i5-1135G7", gpu: "Intel Iris Xe", weight: 1.69, screen: "15.6 FHD" },
  { id: 4, name: "Acer Aspire 5", brand: "Acer", price: 10999000, ram: 8, storage: 256, cpu: "Intel Core i5-1235U", gpu: "Intel Iris Xe", weight: 1.8, screen: "15.6 FHD" },
  { id: 5, name: "Lenovo ThinkBook 14", brand: "Lenovo", price: 15999000, ram: 16, storage: 512, cpu: "Intel Core i7-1255U", gpu: "Intel Iris Xe", weight: 1.4, screen: "14 FHD" },
  { id: 6, name: "ASUS ROG Strix G15", brand: "ASUS", price: 18999000, ram: 16, storage: 512, cpu: "AMD Ryzen 7 6800H", gpu: "RTX 3050", weight: 2.1, screen: "15.6 FHD 144Hz" },
];

interface Laptop {
  id: number;
  name: string;
  brand: string;
  price: number;
  ram: number;
  storage: number;
  cpu: string;
  gpu: string;
  weight: number;
  screen: string;
}

export default function ComparePage() {
  const [selectedLaptops, setSelectedLaptops] = useState<Laptop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredLaptops = MOCK_LAPTOPS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedLaptops.find((s) => s.id === l.id)
  );

  const addLaptop = (laptop: Laptop) => {
    if (selectedLaptops.length < 3) {
      setSelectedLaptops([...selectedLaptops, laptop]);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const removeLaptop = (id: number) => {
    setSelectedLaptops(selectedLaptops.filter((l) => l.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getBestValue = (field: keyof Laptop, higherIsBetter: boolean = true) => {
    if (selectedLaptops.length < 2) return null;
    const values = selectedLaptops.map((l) => l[field]);
    if (typeof values[0] === "number") {
      const best = higherIsBetter
        ? Math.max(...(values as number[]))
        : Math.min(...(values as number[]));
      return best;
    }
    return null;
  };

  const isBest = (laptop: Laptop, field: keyof Laptop, higherIsBetter: boolean = true) => {
    if (selectedLaptops.length < 2) return false;
    const best = getBestValue(field, higherIsBetter);
    if (best === null) return false;
    return laptop[field] === best;
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-dark-700/50 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5">
              <span className="text-lg">⚖️</span>
              <span className="text-sm font-medium text-purple-400">Bandingkan Laptop</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Side-by-Side
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Comparison
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-dark-200">
              Bandingkan spesifikasi 2-3 laptop sekaligus. Cari yang paling cocok untuk kebutuhan kamu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Add Laptop Bar */}
        {selectedLaptops.length < 3 && (
          <div className="relative mb-8">
            <div className="flex items-center gap-3 rounded-2xl border border-dark-600 bg-dark-800 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari laptop untuk ditambahkan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-transparent text-white placeholder-dark-400 outline-none"
                />
              </div>
              <span className="text-sm text-dark-400">
                {selectedLaptops.length}/3 dipilih
              </span>
            </div>

            {/* Dropdown */}
            {showDropdown && searchQuery && filteredLaptops.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-dark-600 bg-dark-800 p-2 shadow-2xl shadow-black/50">
                {filteredLaptops.map((laptop) => (
                  <button
                    key={laptop.id}
                    onClick={() => addLaptop(laptop)}
                    className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-dark-700"
                  >
                    <div>
                      <p className="font-medium text-white">{laptop.name}</p>
                      <p className="text-sm text-dark-400">{laptop.brand} • {laptop.ram}GB RAM</p>
                    </div>
                    <span className="text-sm font-medium text-primary-400">{formatPrice(laptop.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {selectedLaptops.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-dark-600 bg-dark-900/50 p-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-dark-700">
              <span className="text-4xl">📱</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Belum Ada Laptop Dipilih</h3>
            <p className="mb-6 text-dark-300">
              Cari dan tambahkan 2-3 laptop untuk membandingkan spesifikasinya.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Laptop
            </Link>
          </div>
        )}

        {/* Comparison Table */}
        {selectedLaptops.length > 0 && (
          <div className="overflow-x-auto">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedLaptops.length}, minmax(280px, 1fr))` }}>
              {selectedLaptops.map((laptop) => (
                <div
                  key={laptop.id}
                  className="group relative overflow-hidden rounded-2xl border border-dark-600 bg-dark-800 transition-all hover:border-dark-500"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeLaptop(laptop.id)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-dark-700/80 text-dark-400 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Header */}
                  <div className="border-b border-dark-600 bg-gradient-to-br from-dark-700 to-dark-800 p-6">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-dark-600 text-3xl">
                      💻
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-white">{laptop.name}</h3>
                    <p className="text-sm text-dark-300">{laptop.brand}</p>
                    <div className="mt-4">
                      <span className={`text-2xl font-bold ${isBest(laptop, 'price', false) ? 'text-green-400' : 'text-white'}`}>
                        {formatPrice(laptop.price)}
                      </span>
                      {isBest(laptop, 'price', false) && selectedLaptops.length > 1 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                          Termurah
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="divide-y divide-dark-600">
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">Processor</span>
                      <span className="text-sm font-medium text-white">{laptop.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">RAM</span>
                      <span className={`text-sm font-medium ${isBest(laptop, 'ram') ? 'text-green-400' : 'text-white'}`}>
                        {laptop.ram} GB
                        {isBest(laptop, 'ram') && selectedLaptops.length > 1 && ' ✓'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">Storage</span>
                      <span className={`text-sm font-medium ${isBest(laptop, 'storage') ? 'text-green-400' : 'text-white'}`}>
                        {laptop.storage} GB SSD
                        {isBest(laptop, 'storage') && selectedLaptops.length > 1 && ' ✓'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">GPU</span>
                      <span className="text-sm font-medium text-white">{laptop.gpu}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">Layar</span>
                      <span className="text-sm font-medium text-white">{laptop.screen}</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-dark-400">Berat</span>
                      <span className={`text-sm font-medium ${isBest(laptop, 'weight', false) ? 'text-green-400' : 'text-white'}`}>
                        {laptop.weight} kg
                        {isBest(laptop, 'weight', false) && selectedLaptops.length > 1 && ' ✓'}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="border-t border-dark-600 p-4">
                    <Link
                      href={`/laptop/${laptop.id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 font-medium text-white transition-all hover:bg-primary-700"
                    >
                      Lihat Detail
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {selectedLaptops.length > 0 && selectedLaptops.length < 3 && (
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="font-medium text-blue-300">Tips</p>
                <p className="text-sm text-blue-200">
                  Tambah {3 - selectedLaptops.length} laptop lagi untuk perbandingan lebih lengkap.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}