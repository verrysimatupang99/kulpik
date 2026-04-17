"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const JURUSAN_BESAR = [
  { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data Science", color: "from-blue-500/20 to-blue-700/20 border-blue-500/30" },
  { slug: "desain-komunikasi-visual", name: "DKV", icon: "🎨", desc: "Desain, Ilustrasi, Video Editing", color: "from-pink-500/20 to-purple-700/20 border-pink-500/30" },
  { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", desc: "CAD, 3D Modeling, Rendering", color: "from-amber-500/20 to-orange-700/20 border-amber-500/30" },
  { slug: "kedokteran", name: "Kedokteran", icon: "🩺", desc: "Anatomi, Riset, Presentasi", color: "from-green-500/20 to-emerald-700/20 border-green-500/30" },
];

const JURUSAN_KECIL = [
  { slug: "teknik-sipil", name: "Teknik Sipil", icon: "🌉" },
  { slug: "manajemen", name: "Manajemen", icon: "📊" },
  { slug: "akuntansi", name: "Akuntansi", icon: "🧮" },
  { slug: "teknik-elektro", name: "Teknik Elektro", icon: "⚡" },
  { slug: "teknik-mesin", name: "Teknik Mesin", icon: "⚙️" },
  { slug: "ilmu-komunikasi", name: "Ilmu Komunikasi", icon: "📢" },
  { slug: "psikologi", name: "Psikologi", icon: "🧠" },
  { slug: "hukum", name: "Hukum", icon: "⚖️" },
];

const FEATURES = [
  { icon: "🎯", title: "Jurusan-Aware", desc: "Rekomendasi berdasarkan kebutuhan spesifik jurusan kuliah kamu" },
  { icon: "💰", title: "Budget-Friendly", desc: "Filter berdasarkan budget yang kamu miliki, dari 3 juta hingga 40 juta" },
  { icon: "🤖", title: "AI-Powered", desc: "Dapatkan rekomendasi cerdas dengan alasan yang jelas dari AI" },
];

const STEPS = [
  { step: "1", title: "Pilih Jurusan", desc: "Pilih jurusan atau ketik kebutuhan langsung", icon: "🎯" },
  { step: "2", title: "Atur Budget", desc: "Tentukan budget, kami filter yang sesuai", icon: "💰" },
  { step: "3", title: "Dapat Rekomendasi", desc: "AI berikan rekomendasi dengan alasan jelas", icon: "✨" },
];

export default function Home() {
  const [stats, setStats] = useState({ total_laptops: 0, total_brands: 0 });

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(d => {
      if (d.success) setStats(d);
    }).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Stats Badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-dark-600 bg-dark-800/50 px-5 py-2 text-sm text-dark-200 backdrop-blur-sm">
            <span>✅ {stats.total_laptops || 54} Laptop</span>
            <span className="text-dark-500">·</span>
            <span>🏪 {stats.total_brands || 7} Brand</span>
            <span className="text-dark-500">·</span>
            <span>🎓 22 Jurusan</span>
            <span className="text-dark-500">·</span>
            <span>🤖 AI</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Cari Laptop{" "}
            <span className="text-blue-400">
              Tepat
            </span>{" "}
            untuk Kuliahmu
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-dark-200 sm:text-xl">
            Rekomendasi laptop berdasarkan jurusan, budget, dan kebutuhan.
            Didukung AI supaya nggak salah pilih.
          </p>

          {/* CTAs */}
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 sm:flex-row sm:gap-3">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-dark-600 bg-dark-800 p-2 backdrop-blur-sm sm:flex-1">
              <input
                type="text"
                placeholder='Cari laptop... (misal: "ASUS VivoBook" atau "laptop 10 juta")'
                className="flex-1 rounded-xl bg-transparent px-4 py-3 text-white placeholder-dark-400 outline-none"
              />
              <Link
                href="/search"
                className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700"
              >
                Cari
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-dark-700 bg-dark-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-400">Mengapa KulPik?</h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">Bukan sekadar perbandingan spec</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="group rounded-2xl border border-dark-600 bg-dark-800 p-8 transition-all hover:border-primary-500/50 hover:bg-dark-700">
                <div className="mb-4 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-white">{f.title}</h3>
                <p className="text-dark-200">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="border-t border-dark-700 bg-dark-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-400">Pilih Jurusan</h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">Kami rekomendasikan berdasarkan jurusan</p>
          </div>

          {/* Big 4 */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JURUSAN_BESAR.map((j) => (
              <Link
                key={j.slug}
                href={`/jurusan/${j.slug}`}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] ${j.color}`}
              >
                <div className="absolute -right-4 -top-4 text-7xl opacity-10">{j.icon}</div>
                <div className="relative">
                  <div className="mb-3 text-3xl">{j.icon}</div>
                  <h3 className="mb-1 text-lg font-bold text-white">{j.name}</h3>
                  <p className="text-sm text-dark-200">{j.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Small 8 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {JURUSAN_KECIL.map((j) => (
              <Link
                key={j.slug}
                href={`/jurusan/${j.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-800 p-4 transition-all hover:border-primary-500/50 hover:bg-dark-700"
              >
                <span className="text-2xl">{j.icon}</span>
                <span className="text-sm font-medium text-dark-200 transition-colors group-hover:text-white">{j.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/jurusan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 transition-colors hover:text-primary-300"
            >
              Lihat semua jurusan
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-dark-700 bg-dark-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-400">Cara Kerja</h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">3 langkah mudah</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-dark-600 bg-dark-700 p-8 text-center">
                <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white shadow-lg shadow-primary-600/30">
                  {item.step}
                </div>
                <div className="mb-4 mt-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-dark-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-dark-700 bg-dark-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-12 text-center shadow-2xl shadow-primary-600/20">
          <h2 className="mb-3 text-3xl font-bold text-white">Siap Cari Laptop yang Tepat?</h2>
          <p className="mb-8 text-primary-100">Gratis, cepat, dan berdasarkan data — bukan iklan.</p>
          <Link
            href="/search"
            className="inline-block rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-transform hover:scale-105"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
