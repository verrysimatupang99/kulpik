"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";

export default function Hero() {
  const [stats, setStats] = useState({ total_laptops: 0, total_brands: 0, total_jurusan: 22 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        {/* Left — Content */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="badge-accent inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
            AI-Powered Recommendation
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-5xl font-semibold tracking-tighter text-ink sm:text-6xl lg:text-7xl">
            Cari Laptop{" "}
            <span className="text-gradient">Tepat</span>{" "}
            untuk Kuliahmu
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-subtle">
            Rekomendasi laptop berdasarkan jurusan, budget, dan kebutuhan.
            Didukung AI supaya nggak salah pilih. Gratis, cepat, dan berdasarkan data.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/search">
              <Button size="lg" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              } iconPosition="right">
                Mulai Cari Laptop
              </Button>
            </Link>
            <Link href="/ai">
              <Button variant="secondary" size="lg">
                Tanya AI
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            <StatCard label="Laptop" value={stats.total_laptops || 54} change="+12 minggu ini" />
            <StatCard label="Brand" value={stats.total_brands || 7} />
            <StatCard label="Jurusan" value={stats.total_jurusan || 22} />
          </div>
        </div>

        {/* Right — Preview Card */}
        <div className="relative">
          <div className="rounded-3xl border border-edge bg-surface-raised p-4 shadow-2xl">
            <div className="rounded-2xl border border-edge bg-surface p-4">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Chart placeholder */}
                <div className="rounded-2xl bg-surface-overlay p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">Rekomendasi</p>
                      <p className="text-xs text-ink-muted">Berdasarkan jurusan</p>
                    </div>
                    <span className="badge-accent rounded-full px-2.5 py-1 text-xs font-medium">
                      +18.4%
                    </span>
                  </div>

                  {/* Bar chart */}
                  <div className="mt-6 flex h-40 items-end gap-2">
                    {[28, 45, 42, 60, 72, 68, 84, 92].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-accent-700 to-accent-400"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Side cards */}
                <div className="space-y-4">
                  <div className="rounded-2xl bg-accent-500/10 border border-accent-500/20 p-5">
                    <p className="text-sm text-accent-400">Top Pick</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                      ASUS VivoBook
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">
                      Laptop terbaik untuk mahasiswa TI dengan budget 10 juta.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-surface-overlay p-4">
                    <p className="text-sm font-medium text-ink">Spesifikasi</p>
                    <div className="mt-3 space-y-2">
                      {["Ryzen 7 8845HS", "16GB DDR5", "512GB NVMe"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-accent-400" />
                          <span className="text-sm text-ink-subtle">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-accent-500/20 bg-accent-500/10 px-4 py-3 text-sm text-accent-400 shadow-sm lg:block">
            ✨ Rekomendasi akurat berdasarkan data
          </div>
        </div>
      </div>
    </section>
  );
}
