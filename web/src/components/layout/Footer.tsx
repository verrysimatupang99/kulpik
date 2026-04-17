import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-dark-700 bg-dark-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary-600/10 to-primary-700/10 p-8 text-center border border-primary-600/20">
          <h2 className="mb-2 text-2xl font-bold text-white">Siap Cari Laptop yang Tepat?</h2>
          <p className="mb-6 text-dark-200">Gratis, cepat, dan berdasarkan data — bukan iklan.</p>
          <Link
            href="/search"
            className="inline-block rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25"
          >
            Mulai Sekarang
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Produk</h3>
            <ul className="space-y-3 text-sm text-dark-300">
              <li><Link href="/search" className="transition-colors hover:text-primary-400">Cari Laptop</Link></li>
              <li><Link href="/jurusan" className="transition-colors hover:text-primary-400">Rekomendasi Jurusan</Link></li>
              <li><Link href="/compare" className="transition-colors hover:text-primary-400">Bandingkan</Link></li>
              <li><Link href="/ai" className="transition-colors hover:text-primary-400">AI Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Jurusan Populer</h3>
            <ul className="space-y-3 text-sm text-dark-300">
              <li><Link href="/jurusan/teknik-informatika" className="transition-colors hover:text-primary-400">Teknik Informatika</Link></li>
              <li><Link href="/jurusan/desain-komunikasi-visual" className="transition-colors hover:text-primary-400">DKV</Link></li>
              <li><Link href="/jurusan/arsitektur" className="transition-colors hover:text-primary-400">Arsitektur</Link></li>
              <li><Link href="/jurusan/kedokteran" className="transition-colors hover:text-primary-400">Kedokteran</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Brand</h3>
            <ul className="space-y-3 text-sm text-dark-300">
              <li><Link href="/search?brand=ASUS" className="transition-colors hover:text-primary-400">ASUS</Link></li>
              <li><Link href="/search?brand=Lenovo" className="transition-colors hover:text-primary-400">Lenovo</Link></li>
              <li><Link href="/search?brand=HP" className="transition-colors hover:text-primary-400">HP</Link></li>
              <li><Link href="/search?brand=Acer" className="transition-colors hover:text-primary-400">Acer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">KulPik</h3>
            <ul className="space-y-3 text-sm text-dark-300">
              <li><Link href="/about" className="transition-colors hover:text-primary-400">Tentang</Link></li>
              <li>
                <a
                  href="https://github.com/verrysimatupang99/kulpik"
                  className="transition-colors hover:text-primary-400"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub (buka di tab baru)"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 border-t border-dark-700 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-dark-400">
              © 2026 KulPik. Dibuat dengan ❤️ untuk mahasiswa Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/verrysimatupang99/kulpik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
