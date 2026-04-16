import Link from "next/link";

const JURUSAN_POPULER = [
  { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data" },
  { slug: "desain-komunikasi-visual", name: "DKV", icon: "🎨", desc: "Desain, Ilustrasi, Video" },
  { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", desc: "CAD, 3D Modeling, Render" },
  { slug: "kedokteran", name: "Kedokteran", icon: "🩺", desc: "Anatomi, Riset, Presentasi" },
  { slug: "teknik-sipil", name: "Teknik Sipil", icon: "🌉", desc: "AutoCAD, SAP2000, Riset" },
  { slug: "manajemen", name: "Manajemen", icon: "📊", desc: "Office, Analisis, Presentasi" },
  { slug: "akuntansi", name: "Akuntansi", icon: "🧮", desc: "Excel, SAP, Audit" },
  { slug: "teknik-elektro", name: "Teknik Elektro", icon: "⚡", desc: "MATLAB, Simulasi, IoT" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Cari Laptop <span className="text-primary-600">Tepat</span>{" "}
            untuk Kuliahmu
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Rekomendasi laptop berdasarkan jurusan, budget, dan kebutuhanmu.
            Didukung AI supaya nggak salah pilih.
          </p>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            <input
              type="text"
              placeholder="Cari laptop... (misal: ASUS VivoBook, laptop 10 juta)"
              className="flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Link
              href="/search"
              className="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Cari
            </Link>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            atau pilih jurusan kamu di bawah ↓
          </p>
        </div>
      </section>

      {/* Jurusan Populer */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Pilih Jurusan Kamu
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Kami rekomendasikan laptop berdasarkan kebutuhan jurusan
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {JURUSAN_POPULER.map((j) => (
              <Link
                key={j.slug}
                href={`/jurusan/${j.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className="mb-2 text-3xl">{j.icon}</div>
                <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-primary-600">
                  {j.name}
                </h3>
                <p className="text-xs text-gray-500">{j.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/jurusan"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Lihat semua jurusan →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Cara Kerja KulPik
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pilih Jurusan",
                desc: "Pilih jurusan kuliah kamu atau ketik kebutuhan langsung",
                icon: "🎯",
              },
              {
                step: "2",
                title: "Atur Budget",
                desc: "Tentukan budget kamu, kami filter laptop yang sesuai",
                icon: "💰",
              },
              {
                step: "3",
                title: "Dapat Rekomendasi",
                desc: "AI kami berikan rekomendasi terbaik dengan alasan yang jelas",
                icon: "✨",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-3xl">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            Siap Cari Laptop yang Tepat?
          </h2>
          <p className="mb-6 text-primary-100">
            Gratis, cepat, dan berdasarkan data — bukan iklan.
          </p>
          <Link
            href="/search"
            className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
