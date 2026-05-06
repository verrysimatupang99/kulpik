"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const JURUSAN_BESAR = [
  { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data Science", gradient: "from-blue-600/30 to-blue-800/30", border: "border-blue-500/40", glow: "shadow-blue-500/20" },
  { slug: "desain-komunikasi-visual", name: "DKV", icon: "🎨", desc: "Desain, Ilustrasi, Video Editing", gradient: "from-pink-600/30 to-purple-800/30", border: "border-pink-500/40", glow: "shadow-pink-500/20" },
  { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", desc: "CAD, 3D Modeling, Rendering", gradient: "from-amber-600/30 to-orange-800/30", border: "border-amber-500/40", glow: "shadow-amber-500/20" },
  { slug: "kedokteran", name: "Kedokteran", icon: "🩺", desc: "Anatomi, Riset, Presentasi", gradient: "from-green-600/30 to-emerald-800/30", border: "border-green-500/40", glow: "shadow-green-500/20" },
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
  { num: "01", icon: "🎯", title: "Jurusan-Aware", desc: "Rekomendasi berdasarkan kebutuhan spesifik jurusan kuliah kamu. Kami tahu software apa yang dipakai di setiap jurusan." },
  { num: "02", icon: "💰", title: "Budget-Friendly", desc: "Filter berdasarkan budget yang kamu miliki, dari 3 juta hingga 40 juta. Tidak ada laptop di luar budget." },
  { num: "03", icon: "🤖", title: "AI-Powered", desc: "Dapatkan rekomendasi cerdas dengan alasan yang jelas dari AI. Bukan sekadar perbandingan spec." },
];

const STEPS = [
  { step: "1", title: "Pilih Jurusan", desc: "Pilih jurusan atau ketik kebutuhan langsung. Kami akan filter berdasarkan kebutuhan spesifik.", icon: "🎯" },
  { step: "2", title: "Atur Budget", desc: "Tentukan budget yang kamu miliki. Kami hanya tampilkan laptop dalam range harga tersebut.", icon: "💰" },
  { step: "3", title: "Dapat Rekomendasi", desc: "AI berikan 3-5 rekomendasi terbaik dengan alasan jelas. Pilih yang paling cocok!", icon: "✨" },
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
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-subtle via-surface to-surface-raised">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          {/* Stats Badge */}
          <div className="mb-8 inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/80">{stats.total_laptops || 54} Laptop</span>
            </div>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/80">{stats.total_brands || 7} Brand</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/80">22 Jurusan</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/80">🤖 AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Cari Laptop{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                Tepat
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-blue-500/20 blur-lg" />
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white/90">untuk Kuliahmu</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-ink-subtle sm:text-xl lg:text-2xl leading-relaxed">
            Rekomendasi laptop berdasarkan{" "}
            <span className="text-white font-medium">jurusan</span>,{" "}
            <span className="text-white font-medium">budget</span>, dan{" "}
            <span className="text-white font-medium">kebutuhan</span>.
            <br />
            Didukung AI supaya nggak salah pilih.
          </p>

          {/* Search Bar */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <svg className="h-5 w-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder='Cari laptop... (misal: "ASUS VivoBook" atau "laptop 10 juta")'
                className="flex-1 bg-transparent py-3 text-white placeholder-dark-400 outline-none"
              />
              <Link
                href="/search"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Cari
              </Link>
            </div>
            <p className="mt-3 text-sm text-ink-faint">
              ✨ Gratis • ⚡ Cepat • 📊 Berdasarkan Data
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-edge/50 bg-surface-subtle px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              Mengapa KulPik?
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Bukan sekadar<br />perbandingan spec
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-edge bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:w-full" />

                {/* Number badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{f.icon}</span>
                  <span className="rounded-full bg-surface-raised px-3 py-1 text-xs font-bold text-ink-muted">{f.num}</span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="border-t border-edge/50 bg-surface-subtle px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400">
              Pilih Jurusan
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Kami rekomendasikan<br />berdasarkan jurusan
            </h2>
          </div>

          {/* Big 4 */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JURUSAN_BESAR.map((j) => (
              <Link
                key={j.slug}
                href={`/jurusan/${j.slug}`}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${j.gradient} ${j.border} hover:${j.glow}`}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Icon bg */}
                <div className="absolute -right-4 -top-4 text-8xl opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
                  {j.icon}
                </div>

                <div className="relative">
                  <div className="mb-4 text-4xl">{j.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-white">{j.name}</h3>
                  <p className="text-sm text-white/70">{j.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-white/50 transition-colors group-hover:text-white/80">
                    Lihat rekomendasi
                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-edge bg-surface p-4 transition-all hover:border-edge-hover hover:bg-surface-raised"
              >
                {/* Left accent */}
                <div className="absolute left-0 top-0 h-full w-0 bg-blue-500/10 transition-all duration-300 group-hover:w-1" />
                <span className="text-2xl transition-transform group-hover:scale-110">{j.icon}</span>
                <span className="text-sm font-medium text-ink-subtle transition-colors group-hover:text-white">{j.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/jurusan"
              className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-6 py-3 text-sm font-semibold text-white transition-all hover:border-blue-500/30 hover:bg-surface-raised"
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
      <section className="border-t border-edge/50 bg-surface-subtle px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400">
              Cara Kerja
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              3 langkah mudah
            </h2>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div className="absolute left-1/2 top-12 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 md:block" />

            {STEPS.map((item, i) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-edge bg-surface p-8 text-center transition-all hover:border-edge-hover hover:shadow-xl"
              >
                {/* Step number */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/30">
                  {item.step}
                </div>

                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{item.desc}</p>

                {/* Arrow (except last) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                    <svg className="h-8 w-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-edge/50 bg-surface-subtle px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 text-center shadow-2xl shadow-blue-500/20 sm:p-16">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                Siap Cari Laptop<br />yang Tepat?
              </h2>
              <p className="mx-auto mb-10 max-w-lg text-lg text-blue-100">
                Gratis, cepat, dan berdasarkan data — bukan iklan.
                Mulai sekarang dan temukan laptop impianmu.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-blue-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Mulai Sekarang
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
