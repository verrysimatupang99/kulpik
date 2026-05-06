import Link from "next/link";

const TEAM = [
  { name: "Verry", role: "Developer", emoji: "👨‍💻" },
  { name: "AI", role: "Assistant", emoji: "🤖" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Jurusan-Aware",
    description: "Rekomendasi berdasarkan kebutuhan spesifik tiap jurusan. Kami tahu software apa yang dipakai.",
    color: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/30",
  },
  {
    icon: "💰",
    title: "Budget-Friendly",
    description: "Filter berdasarkan budget. Tidak ada laptop di luar range harga yang kamu mau.",
    color: "from-green-500/20 to-green-600/20",
    border: "border-green-500/30",
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    description: "Dapatkan rekomendasi cerdas dengan alasan yang jelas dari AI. Bukan sekadar perbandingan spec.",
    color: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/30",
  },
  {
    icon: "📊",
    title: "Data-Driven",
    description: "Data spesifikasi lengkap dari marketplace Indonesia. Harga real-time, bukan estimasi.",
    color: "from-amber-500/20 to-amber-600/20",
    border: "border-amber-500/30",
  },
];

const TECH_STACK = [
  { name: "Next.js", category: "Frontend", version: "16" },
  { name: "React", category: "Frontend", version: "19" },
  { name: "Tailwind CSS", category: "Styling", version: "4" },
  { name: "Flask", category: "Backend", version: "" },
  { name: "Supabase", category: "Database", version: "" },
  { name: "Google Gemini", category: "AI", version: "" },
  { name: "Cohere", category: "Embeddings", version: "" },
  { name: "EXA", category: "Search", version: "" },
];

const FAQS = [
  {
    q: "Apakah KulPik gratis?",
    a: "Ya, KulPik 100% gratis untuk semua pengguna. Kami menghasilkan revenue dari affiliate links.",
  },
  {
    q: "Dari mana data harga berasal?",
    a: "Data kami berasal dari marketplace Indonesia seperti Tokopedia dan Shopee, yang diupdate secara berkala.",
  },
  {
    q: "Apakah rekomendasi AI akurat?",
    a: "AI kami mempertimbangkan spesifikasi, kebutuhan jurusan, dan budget. Namun keputusan akhir tetap di tangan kamu.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-edge/50 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
            <span className="text-lg">🎓</span>
            <span className="text-sm font-medium text-primary-400">Tentang KulPik</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Platform Rekomendasi Laptop
            <span className="block bg-gradient-to-r from-blue-400 via-primary-400 to-cyan-400 bg-clip-text text-transparent">
              untuk Mahasiswa Indonesia
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-ink-subtle">
            Kami membantu mahasiswa Indonesia menemukan laptop yang tepat untuk jurusan mereka. 
            Bukan sekadar perbandingan spec, tapi rekomendasi yang cerdas dan kontekstual.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-edge bg-gradient-to-br from-dark-800 to-dark-900 p-10 sm:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Misi Kami</h2>
              <p className="mb-6 text-ink-subtle">
                Setiap tahun, ~2 juta lulusan SMA bingung memilih laptop untuk kuliah. 
                Kami percaya pemilihan laptop yang tepat dapat meningkatkan produktivitas dan pengalaman belajar.
              </p>
              <p className="text-ink-subtle">
                KulPik hadir untuk memberikan rekomendasi yang objektif, data-driven, dan sesuai dengan kebutuhan 
                spesifik setiap jurusan.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -right-4 -top-4 text-8xl opacity-10">🎯</div>
              <div className="relative rounded-2xl border border-primary-500/20 bg-primary-500/5 p-6">
                <div className="mb-3 text-4xl">💡</div>
                <p className="text-lg font-medium text-white">"Laptop yang tepat bukan yang paling mahal,</p>
                <p className="text-lg font-medium text-primary-400">tapi yang paling cocok."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Mengapa KulPik?</h2>
          <p className="text-ink-subtle">Platform rekomendasi laptop yang mengerti kebutuhan mahasiswa Indonesia</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:-translate-y-1 hover:shadow-2xl ${v.color} ${v.border}`}
            >
              <div className="mb-4 text-4xl">{v.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-white">{v.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Kenapa Bukan Platform Lain?</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-edge">
                <th className="p-4 text-left text-sm font-medium text-ink-muted">Platform</th>
                <th className="p-4 text-center text-sm font-medium text-ink-muted">Harga Lokal</th>
                <th className="p-4 text-center text-sm font-medium text-ink-muted">Konteks Jurusan</th>
                <th className="p-4 text-center text-sm font-medium text-ink-muted">AI Rekomendasi</th>
                <th className="p-4 text-center text-sm font-medium text-ink-muted">Gratis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-edge">
                <td className="p-4 font-medium text-ink-muted">TikTok/YouTube</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-green-400">✓</td>
              </tr>
              <tr className="border-b border-edge">
                <td className="p-4 font-medium text-ink-muted">ChatGPT</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-amber-400">~</td>
                <td className="p-4 text-center text-green-400">✓</td>
                <td className="p-4 text-center text-amber-400">~</td>
              </tr>
              <tr className="border-b border-edge">
                <td className="p-4 font-medium text-ink-muted">Pricebook</td>
                <td className="p-4 text-center text-green-400">✓</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-red-400">❌</td>
                <td className="p-4 text-center text-green-400">✓</td>
              </tr>
              <tr className="border-b border-primary-500/30 bg-primary-500/5">
                <td className="p-4 font-bold text-primary-400">KulPik</td>
                <td className="p-4 text-center text-green-400">✓</td>
                <td className="p-4 text-center text-green-400">✓</td>
                <td className="p-4 text-center text-green-400">✓</td>
                <td className="p-4 text-center text-green-400">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Dibangun Dengan</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TECH_STACK.map((tech, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-edge bg-surface p-4 transition-all hover:border-edge-hover"
            >
              <div>
                <p className="font-medium text-white">{tech.name}</p>
                <p className="text-sm text-ink-faint">{tech.category}</p>
              </div>
              {tech.version && (
                <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-xs font-medium text-primary-400">
                  v{tech.version}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Pertanyaan Umum</h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group overflow-hidden rounded-xl border border-edge bg-surface transition-all hover:border-edge-hover"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5">
                <span className="font-medium text-white">{faq.q}</span>
                <svg
                  className="h-5 w-5 text-ink-faint transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-edge bg-surface-raised/50 p-5">
                <p className="text-ink-subtle">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-10 text-center shadow-2xl shadow-primary-500/20 sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Siap Cari Laptop yang Tepat?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-blue-100">
             Gratis, cepat, dan berdasarkan data — bukan iklan. Mulai sekarang dan temukan laptop impianmu.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Cari Laptop
              </Link>
              <Link
                href="/jurusan"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
              >
                <span>🎓</span>
                Pilih Jurusan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}