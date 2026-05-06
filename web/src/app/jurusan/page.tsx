import Link from "next/link";
import { ErrorBoundary } from "@/components/ui";

const JURUSAN_CATEGORIES = [
  {
    title: "Teknik & Komputer",
    color: "from-blue-600/30 to-blue-800/30",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/10",
    accent: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    items: [
      { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data Science. Butuh CPU kuat & RAM besar.", minRam: 16, needGpu: false },
      { slug: "teknik-elektro", name: "Teknik Elektro", icon: "⚡", desc: "MATLAB, Simulink, PCB design. CPU kuat & RAM cukup.", minRam: 16, needGpu: false },
    ],
  },
  {
    title: "Desain & Arsitektur",
    color: "from-pink-600/30 to-purple-800/30",
    border: "border-pink-500/40",
    glow: "shadow-pink-500/10",
    accent: "text-pink-400",
    accentBg: "bg-pink-500/10",
    accentBorder: "border-pink-500/20",
    items: [
      { slug: "desain-komunikasi-visual", name: "DKV", icon: "🎨", desc: "Adobe Suite, Figma. GPU dedicated & layar akurat.", minRam: 16, needGpu: true },
      { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", desc: "AutoCAD, SketchUp, Lumion. GPU & RAM besar untuk render.", minRam: 16, needGpu: true },
    ],
  },
  {
    title: "Teknik Berat",
    color: "from-amber-600/30 to-orange-800/30",
    border: "border-amber-500/40",
    glow: "shadow-amber-500/10",
    accent: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    items: [
      { slug: "teknik-sipil", name: "Teknik Sipil", icon: "🌉", desc: "SAP2000, ETABS, AutoCAD. Performa tinggi & GPU.", minRam: 16, needGpu: true },
      { slug: "teknik-mesin", name: "Teknik Mesin", icon: "⚙️", desc: "SolidWorks, CATIA, ANSYS. GPU dedicated & RAM 16GB+.", minRam: 16, needGpu: true },
    ],
  },
  {
    title: "Sains & Kesehatan",
    color: "from-green-600/30 to-emerald-800/30",
    border: "border-green-500/40",
    glow: "shadow-green-500/10",
    accent: "text-green-400",
    accentBg: "bg-green-500/10",
    accentBorder: "border-green-500/20",
    items: [
      { slug: "kedokteran", name: "Kedokteran", icon: "🩺", desc: "Ringan, baterai awet. Fokus presentasi & baca PDF.", minRam: 8, needGpu: false },
      { slug: "psikologi", name: "Psikologi", icon: "🧠", desc: "SPSS, riset, statistik. Laptop standar sudah cukup.", minRam: 8, needGpu: false },
    ],
  },
  {
    title: "Bisnis & Sosial",
    color: "from-cyan-600/30 to-teal-800/30",
    border: "border-cyan-500/40",
    glow: "shadow-cyan-500/10",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    items: [
      { slug: "manajemen", name: "Manajemen", icon: "📊", desc: "Office, Excel, presentasi. Ringan & baterai awet.", minRam: 8, needGpu: false },
      { slug: "akuntansi", name: "Akuntansi", icon: "🧮", desc: "Excel besar, software akuntansi. Numpad penting.", minRam: 8, needGpu: false },
      { slug: "ilmu-komunikasi", name: "Ilmu Komunikasi", icon: "📢", desc: "Video editing ringan, Canva, social media.", minRam: 8, needGpu: false },
      { slug: "hukum", name: "Hukum", icon: "⚖️", desc: "Banyak mengetik & baca dokumen. Keyboard nyaman.", minRam: 8, needGpu: false },
    ],
  },
];

export default function JurusanPage() {
  return (
    <ErrorBoundary>
      <JurusanPageContent />
    </ErrorBoundary>
  );
}

function JurusanPageContent() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-edge/50 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
              <span className="text-lg">🎓</span>
              <span className="text-sm font-medium text-blue-400">Pilih Jurusan</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Rekomendasi Berdasarkan
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Jurusan
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-ink-subtle">
              Setiap jurusan punya kebutuhan laptop yang beda. Pilih jurusan kamu untuk dapat rekomendasi yang tepat.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {JURUSAN_CATEGORIES.map((cat) => (
            <div key={cat.title}>
              {/* Category Title */}
              <div className="mb-5 flex items-center gap-3">
                <div className={`h-px flex-1 bg-gradient-to-r ${cat.color}`} />
                <h2 className={`text-lg font-semibold ${cat.accent}`}>{cat.title}</h2>
                <div className={`h-px flex-1 bg-gradient-to-l ${cat.color}`} />
              </div>

              {/* Jurusan Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cat.items.map((j) => (
                  <Link
                    key={j.slug}
                    href={`/jurusan/${j.slug}`}
                    className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cat.color} ${cat.border} hover:${cat.glow}`}
                  >
                    {/* Background icon */}
                    <div className="absolute -right-3 -top-3 text-7xl opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
                      {j.icon}
                    </div>

                    <div className="relative">
                      <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                        {j.icon}
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-white">{j.name}</h3>
                      <p className="mb-4 text-sm leading-relaxed text-white/70">{j.desc}</p>

                      {/* Specs Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cat.accentBg} ${cat.accentBorder} ${cat.accent}`}>
                          {j.minRam}GB RAM
                        </span>
                        {j.needGpu && (
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cat.accentBg} ${cat.accentBorder} ${cat.accent}`}>
                            GPU Dedicated
                          </span>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-white/50 transition-colors group-hover:text-white/80">
                        Lihat rekomendasi
                        <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-edge bg-surface p-8">
            <p className="mb-4 text-ink-muted">Tidak yakin jurusan apa? Coba tanya AI kami.</p>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25"
            >
              <span>🤖</span>
              Tanya AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}