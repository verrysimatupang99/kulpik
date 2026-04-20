"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/search", label: "Cari Laptop" },
  { href: "/jurusan", label: "Jurusan" },
  { href: "/compare", label: "Bandingkan" },
  { href: "/ai", label: "AI Rekomendasi" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-edge glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-xl">🎓</span>
          <span className="text-lg font-semibold tracking-tight text-ink">
            Kul<span className="text-accent-400">Pik</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-subtle transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            className="text-sm font-medium text-ink-subtle transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <Link href="/search">
            <Button size="sm">Mulai Cari</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-subtle hover:bg-surface-overlay md:hidden"
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

      {/* Mobile Dropdown */}
      {open && (
        <div className="border-t border-edge bg-surface md:hidden">
          <nav className="space-y-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-ink-subtle hover:bg-surface-overlay hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/search" onClick={() => setOpen(false)}>
                <Button className="w-full">Mulai Cari</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
