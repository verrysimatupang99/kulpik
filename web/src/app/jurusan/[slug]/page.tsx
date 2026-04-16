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
        <h1 className="mb-2 text-2xl font-bold">Jurusan tidak ditemukan</h1>
        <Link href="/jurusan" className="text-primary-600 hover:underline">← Kembali ke daftar jurusan</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/jurusan" className="mb-6 inline-block text-sm text-primary-600 hover:underline">← Semua Jurusan</Link>

      <div className="mb-8">
        <div className="mb-2 text-5xl">{jurusan.icon}</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{jurusan.name}</h1>
        <p className="text-gray-600">{jurusan.desc}</p>
      </div>

      {/* Minimum Specs */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Spesifikasi Minimum</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-blue-700">{jurusan.minRam}GB</div>
            <div className="text-sm text-blue-600">RAM Minimum</div>
          </div>
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-green-700">{jurusan.minStorage}GB</div>
            <div className="text-sm text-green-600">Storage Minimum</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-purple-700">{jurusan.needGpu ? "Perlu" : "Opsional"}</div>
            <div className="text-sm text-purple-600">GPU Dedicated</div>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-orange-700">SSD</div>
            <div className="text-sm text-orange-600">Storage Type</div>
          </div>
        </div>
      </div>

      {/* Software */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Software yang Dipakai</h2>
        <div className="flex flex-wrap gap-2">
          {jurusan.software.map((s) => (
            <span key={s} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">{s}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center text-white">
        <h2 className="mb-2 text-xl font-bold">Siap Cari Laptop untuk {jurusan.name}?</h2>
        <p className="mb-4 text-primary-100">Kami sudah filter laptop yang cocok untuk jurusan kamu.</p>
        <Link href={`/search?q=${encodeURIComponent(jurusan.name)}`} className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 hover:bg-primary-50">
          Lihat Rekomendasi
        </Link>
      </div>
    </div>
  );
}
