import Link from "next/link";

const JURUSAN_BESAR = [
  { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data Science", color: "from-blue-500 to-blue-700" },
  { slug: "desain-komunikasi-visual", name: "DKV", icon: "🎨", desc: "Desain, Ilustrasi, Video Editing", color: "from-pink-500 to-purple-700" },
  { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", desc: "CAD, 3D Modeling, Rendering", color: "from-amber-500 to-orange-700" },
  { slug: "kedokteran", name: "Kedokteran", icon: "🩺", desc: "Anatomi, Riset, Presentasi", color: "from-green-500 to-emerald-700" },
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

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span>✅ 54 Laptop</span>
            <span className="text-white/40">·</span>
            <span>🏪 7 Brand</span>
            <span className="text-white/40">·</span>
            <span>🎓 12 Jurusan</span>
            <span className="text-white/40">·</span>
            <span>🤖 AI</span>
          </div>
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cari Laptop <span className="text-yellow-300">Tepat</span>{" "}
            untuk Kuliahmu
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 sm:text-xl">
            Rekomendasi laptop berdasarkan jurusan, budget, dan kebutuhan.
            Didukung AI supaya nggak salah pilih.
          </p>
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
            <input
              type="text"
              placeholder='Cari laptop... (misal: "ASUS VivoBook" atau "laptop 10 juta")'
              className="flex-1 rounded-xl bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 outline-none"
            />
            <Link href="/search" className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
              Cari
            </Link>
          </div>
        </div>
      </section>

      {/* Jurusan Picks */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Pilih Jurusan Kamu</h2>
            <p className="mt-2 text-gray-500">Kami rekomendasikan laptop berdasarkan kebutuhan jurusan</p>
          </div>

          {/* Big 4 */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JURUSAN_BESAR.map((j) => (
              <Link key={j.slug} href={`/jurusan/${j.slug}`} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${j.color} p-6 text-white transition-transform hover:scale-[1.02]`}>
                <div className="absolute -right-4 -top-4 text-7xl opacity-20">{j.icon}</div>
                <div className="relative">
                  <div className="mb-3 text-3xl">{j.icon}</div>
                  <h3 className="mb-1 text-lg font-bold">{j.name}</h3>
                  <p className="text-sm text-white/80">{j.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Small 8 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {JURUSAN_KECIL.map((j) => (
              <Link key={j.slug} href={`/jurusan/${j.slug}`} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-primary-300 hover:shadow-sm">
                <span className="text-2xl">{j.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{j.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/jurusan" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Lihat semua jurusan →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">Cara Kerja KulPik</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Pilih Jurusan", desc: "Pilih jurusan atau ketik kebutuhan langsung", icon: "🎯" },
              { step: "2", title: "Atur Budget", desc: "Tentukan budget, kami filter yang sesuai", icon: "💰" },
              { step: "3", title: "Dapat Rekomendasi", desc: "AI berikan rekomendasi dengan alasan jelas", icon: "✨" },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <div className="mb-3 mt-2 text-4xl">{item.icon}</div>
                <h3 className="mb-1 font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-center text-white shadow-xl">
          <h2 className="mb-3 text-2xl font-bold">Siap Cari Laptop yang Tepat?</h2>
          <p className="mb-6 text-primary-100">Gratis, cepat, dan berdasarkan data — bukan iklan.</p>
          <Link href="/search" className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-primary-700 shadow-lg transition-transform hover:scale-105">
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
