import Link from "next/link";

const NAV_LINKS = [
  { href: "/search", label: "Cari Laptop" },
  { href: "/jurusan", label: "Jurusan" },
  { href: "/compare", label: "Bandingkan" },
  { href: "/ai", label: "AI Rekomendasi" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-600">🎓</span>
          <span className="text-xl font-bold text-gray-900">
            Kul<span className="text-primary-600">Pik</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Mulai Cari
          </Link>
        </div>
      </div>
    </header>
  );
}
