"use client";

import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-accent-500/10 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-accent-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-6xl font-bold text-ink">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-ink-subtle">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mb-8 max-w-md text-ink-muted">
            Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value=""
              onChange={() => {}}
              placeholder="Cari laptop atau informasi..."
              onSubmit={() => {}}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-xl bg-accent-500 px-6 py-3 font-medium text-dark-900 hover:bg-accent-400 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/search"
              className="rounded-xl border border-edge-strong px-6 py-3 font-medium text-ink hover:bg-surface-raised transition-colors"
            >
              Cari Laptop
            </Link>
            <Link
              href="/ai"
              className="rounded-xl border border-edge-strong px-6 py-3 font-medium text-ink hover:bg-surface-raised transition-colors"
            >
              Tanya AI
            </Link>
            <Link
              href="/jurusan"
              className="rounded-xl border border-edge-strong px-6 py-3 font-medium text-ink hover:bg-surface-raised transition-colors"
            >
              Pilih Jurusan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}