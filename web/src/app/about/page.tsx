import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 text-5xl">🎓</div>
        <h1 className="mb-4 text-4xl font-bold text-white">Tentang KulPik</h1>
        <p className="text-lg text-dark-200">
          Platform rekomendasi laptop untuk mahasiswa Indonesia
        </p>
      </div>

      {/* Mission */}
      <div className="mb-12 rounded-2xl border border-dark-600 bg-dark-800 p-8">
        <h2 className="mb-4 text-2xl font-bold text-white">Misi Kami</h2>
        <p className="text-dark-200 leading-relaxed">
          KulPik hadir untuk membantu mahasiswa Indonesia menemukan laptop yang tepat untuk jurusan mereka.
          Kami percaya bahwa pemilihan laptop yang tepat dapat meningkatkan produktivitas dan pengalaman belajar.
        </p>
      </div>

      {/* Why KulPik */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-white">Mengapa KulPik?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="mb-2 text-lg font-bold text-white">Data-Driven</h3>
            <p className="text-sm text-dark-200">Rekomendasi berdasarkan data spesifikasi dan kebutuhan jurusan</p>
          </div>
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
            <div className="mb-3 text-3xl">🤖</div>
            <h3 className="mb-2 text-lg font-bold text-white">AI-Powered</h3>
            <p className="text-sm text-dark-200">Dukungan AI untuk memberikan alasan yang jelas</p>
          </div>
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
            <div className="mb-3 text-3xl">💰</div>
            <h3 className="mb-2 text-lg font-bold text-white">Harga Lokal</h3>
            <p className="text-sm text-dark-200">Harga dari marketplace Indonesia seperti Tokopedia dan Shopee</p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-12 rounded-2xl border border-dark-600 bg-dark-800 p-8">
        <h2 className="mb-4 text-2xl font-bold text-white">Tech Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-primary-400">Frontend</h3>
            <p className="text-sm text-dark-200">Next.js 16, React 19, Tailwind CSS 4</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-primary-400">Backend</h3>
            <p className="text-sm text-dark-200">Flask API, Python 3.11</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-primary-400">Database</h3>
            <p className="text-sm text-dark-200">Supabase (PostgreSQL + pgvector)</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-primary-400">AI</h3>
            <p className="text-sm text-dark-200">Google Gemini, Cohere Embeddings</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/search"
          className="inline-block rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white transition-all hover:bg-primary-700"
        >
          Mulai Cari Laptop
        </Link>
      </div>
    </div>
  );
}
