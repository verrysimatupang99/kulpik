import Link from "next/link";

const JURUSAN_DATA: Record<string, { name: string; icon: string; desc: string; minRam: number; minStorage: number; needGpu: boolean; software: string[] }> = {
  "teknik-informatika": { name: "Teknik Informatika", icon: "💻", desc: "Programming, AI, Data Science", minRam: 16, minStorage: 512, needGpu: false, software: ["VS Code", "Docker", "IntelliJ", "Postman", "Terminal"] },
  "desain-komunikasi-visual": { name: "Desain Komunikasi Visual", icon: "🎨", desc: "Desain Grafis, Ilustrasi, Video Editing", minRam: 16, minStorage: 512, needGpu: true, software: ["Adobe Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Figma"] },
  "arsitektur": { name: "Arsitektur", icon: "🏗️", desc: "CAD, 3D Modeling, Rendering", minRam: 16, minStorage: 512, needGpu: true, software: ["AutoCAD", "SketchUp", "Lumion", "Revit", "3ds Max"] },
  "kedokteran": { name: "Kedokteran", icon: "🩺", desc: "Anatomi, Riset, Presentasi", minRam: 8, minStorage: 256, needGpu: false, software: ["PowerPoint", "PDF Reader", "Anatomy Atlas", "SPSS"] },
  "teknik-sipil": { name: "Teknik Sipil", icon: "🌉", desc: "Struktur, Konstruksi, Analisis", minRam: 16, minStorage: 512, needGpu: true, software: ["AutoCAD", "SAP2000", "ETABS", "SketchUp", "Excel"] },
  "manajemen": { name: "Manajemen", icon: "📊", desc: "Bisnis, Analisis, Presentasi", minRam: 8, minStorage: 256, needGpu: false, software: ["Excel", "PowerPoint", "SPSS", "Tableau", "Word"] },
  "akuntansi": { name: "Akuntansi", icon: "🧮", desc: "Audit, Pajak, Keuangan", minRam: 8, minStorage: 256, needGpu: false, software: ["Excel", "SAP", "Accurate", "MYOB", "Power BI"] },
  "teknik-elektro": { name: "Teknik Elektro", icon: "⚡", desc: "Elektronika, IoT, Simulasi", minRam: 16, minStorage: 512, needGpu: false, software: ["MATLAB", "Simulink", "Proteus", "Arduino IDE", "Eagle PCB"] },
  "teknik-mesin": { name: "Teknik Mesin", icon: "⚙️", desc: "Desain Mekanik, Simulasi, CAD", minRam: 16, minStorage: 512, needGpu: true, software: ["SolidWorks", "CATIA", "ANSYS", "AutoCAD", "MATLAB"] },
  "ilmu-komunikasi": { name: "Ilmu Komunikasi", icon: "📢", desc: "Media, Jurnalistik, PR", minRam: 8, minStorage: 256, needGpu: false, software: ["Canva", "Premiere Pro", "Word", "PowerPoint", "WordPress"] },
  "psikologi": { name: "Psikologi", icon: "🧠", desc: "Riset, Statistik, Klinis", minRam: 8, minStorage: 256, needGpu: false, software: ["SPSS", "JASP", "Excel", "PowerPoint", "Mendeley"] },
  "hukum": { name: "Hukum", icon: "⚖️", desc: "Perundangan, Riset, Dokumen", minRam: 8, minStorage: 256, needGpu: false, software: ["Word", "PDF Reader", "LexisNexis", "PowerPoint", "Excel"] },
};

export default async function JurusanDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jurusan = JURUSAN_DATA[slug];

  if (!jurusan) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🔍</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Jurusan tidak ditemukan</h1>
        <Link href="/jurusan" className="text-primary-400 hover:text-primary-300">← Kembali ke daftar jurusan</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/jurusan" className="mb-6 inline-flex items-center gap-2 text-sm text-dark-300 transition-colors hover:text-white">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Semua Jurusan
      </Link>

      {/* Hero */}
      <div className="mb-8 rounded-2xl border border-dark-600 bg-gradient-to-r from-primary-600/10 to-primary-700/10 p-8">
        <div className="mb-3 text-5xl">{jurusan.icon}</div>
        <h1 className="mb-2 text-3xl font-bold text-white">{jurusan.name}</h1>
        <p className="text-dark-200">{jurusan.desc}</p>
      </div>

      {/* Minimum Specs */}
      <div className="mb-8 rounded-2xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="mb-5 text-lg font-semibold text-white">Spesifikasi Minimum</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5 text-center">
            <div className="mb-1 text-3xl font-bold text-blue-400">{jurusan.minRam}GB</div>
            <div className="text-sm text-blue-300">RAM Minimum</div>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-5 text-center">
            <div className="mb-1 text-3xl font-bold text-green-400">{jurusan.minStorage}GB</div>
            <div className="text-sm text-green-300">Storage Minimum</div>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-5 text-center">
            <div className="mb-1 text-3xl font-bold text-purple-400">{jurusan.needGpu ? "Perlu" : "Opsional"}</div>
            <div className="text-sm text-purple-300">GPU Dedicated</div>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-5 text-center">
            <div className="mb-1 text-3xl font-bold text-orange-400">SSD</div>
            <div className="text-sm text-orange-300">Storage Type</div>
          </div>
        </div>
      </div>

      {/* Software */}
      <div className="mb-8 rounded-2xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="mb-5 text-lg font-semibold text-white">Software yang Dipakai</h2>
        <div className="flex flex-wrap gap-2">
          {jurusan.software.map((s) => (
            <span key={s} className="rounded-full border border-dark-500 bg-dark-700 px-4 py-2 text-sm text-dark-200">{s}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center shadow-xl shadow-primary-600/10">
        <h2 className="mb-2 text-xl font-bold text-white">Siap Cari Laptop untuk {jurusan.name}?</h2>
        <p className="mb-6 text-primary-100">Kami sudah filter laptop yang cocok untuk jurusan kamu.</p>
        <Link
          href={`/search?q=${encodeURIComponent(jurusan.name)}`}
          className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-primary-700 transition-transform hover:scale-105"
        >
          Lihat Rekomendasi
        </Link>
      </div>
    </div>
  );
}
