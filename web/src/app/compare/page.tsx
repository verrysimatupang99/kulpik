import Link from "next/link";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-4 text-5xl">⚖️</div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Bandingkan Laptop</h1>
        <p className="mx-auto mb-8 max-w-lg text-gray-500">
          Pilih 2-3 laptop untuk dibandingkan spesifikasinya secara langsung.
        </p>
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12">
          <p className="mb-4 text-sm text-gray-400">Fitur ini sedang dalam pengembangan</p>
          <p className="mb-6 text-xs text-gray-400">
            Sementara itu, coba fitur pencarian untuk menemukan laptop yang cocok
          </p>
          <Link href="/search" className="inline-block rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
            Cari Laptop
          </Link>
        </div>
      </div>
    </div>
  );
}
