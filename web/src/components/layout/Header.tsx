"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/search", label: "Cari Laptop" },
  { href: "/jurusan", label: "Jurusan" },
  { href: "/compare", label: "Bandingkan" },
  { href: "/ai", label: "AI Rekomendasi" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold text-white">
            Kul<span className="text-primary-500">Pik</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25"
          >
            Mulai Cari
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-dark-200 hover:bg-dark-700 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-dark-700 bg-dark-800 md:hidden">
          <nav className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-dark-200 hover:bg-dark-700 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-primary-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Mulai Cari
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
