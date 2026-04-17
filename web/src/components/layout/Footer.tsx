import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Produk</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-primary-600">Cari Laptop</Link></li>
              <li><Link href="/jurusan" className="hover:text-primary-600">Rekomendasi Jurusan</Link></li>
              <li><Link href="/compare" className="hover:text-primary-600">Bandingkan</Link></li>
              <li><Link href="/ai" className="hover:text-primary-600">AI Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Jurusan Populer</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/jurusan/teknik-informatika" className="hover:text-primary-600">Teknik Informatika</Link></li>
              <li><Link href="/jurusan/desain-komunikasi-visual" className="hover:text-primary-600">DKV</Link></li>
              <li><Link href="/jurusan/arsitektur" className="hover:text-primary-600">Arsitektur</Link></li>
              <li><Link href="/jurusan/kedokteran" className="hover:text-primary-600">Kedokteran</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Brand</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search?brand=ASUS" className="hover:text-primary-600">ASUS</Link></li>
              <li><Link href="/search?brand=Lenovo" className="hover:text-primary-600">Lenovo</Link></li>
              <li><Link href="/search?brand=HP" className="hover:text-primary-600">HP</Link></li>
              <li><Link href="/search?brand=Acer" className="hover:text-primary-600">Acer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">KulPik</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-primary-600">Tentang</Link></li>
              <li><a href="https://github.com/verrysimatupang99/kulpik" className="hover:text-primary-600" target="_blank" rel="noopener noreferrer" aria-label="GitHub (buka di tab baru)">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © 2026 KulPik. Dibuat dengan ❤️ untuk mahasiswa Indonesia.
        </div>
      </div>
    </footer>
  );
}
