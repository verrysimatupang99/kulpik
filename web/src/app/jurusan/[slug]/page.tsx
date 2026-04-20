import Link from "next/link";

const JURUSAN_DATA: Record<string, {
  name: string;
  icon: string;
  desc: string;
  minRam: number;
  minStorage: number;
  needGpu: boolean;
  software: string[];
  tips: string[];
}> = {
  "teknik-informatika": {
    name: "Teknik Informatika",
    icon: "💻",
    desc: "Programming, AI, Data Science",
    minRam: 16,
    minStorage: 512,
    needGpu: false,
    software: ["VS Code", "Docker", "IntelliJ", "Postman", "Terminal", "Git"],
    tips: ["CPU multi-core untuk compile cepat", "RAM 16GB+ untuk VM/container", "SSD untuk build time singkat", "Keyboard nyaman untuk coding"]
  },
  "desain-komunikasi-visual": {
    name: "Desain Komunikasi Visual",
    icon: "🎨",
    desc: "Desain Grafis, Ilustrasi, Video Editing",
    minRam: 16,
    minStorage: 512,
    needGpu: true,
    software: ["Adobe Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Figma", "Blender"],
    tips: ["Layar IPS untuk akurasi warna", "GPU dedicated untuk rendering", "RAM 16GB+ untuk multitasking", "Storage besar untuk aset"]
  },
  "arsitektur": {
    name: "Arsitektur",
    icon: "🏗️",
    desc: "CAD, 3D Modeling, Rendering",
    minRam: 16,
    minStorage: 512,
    needGpu: true,
    software: ["AutoCAD", "SketchUp", "Lumion", "Revit", "3ds Max", "V-Ray"],
    tips: ["GPU dedicated wajib untuk render", "RAM 16GB+ minimum", "Layar besar untuk detail", "Mouse dengan banyak tombol"]
  },
  "kedokteran": {
    name: "Kedokteran",
    icon: "🩺",
    desc: "Anatomi, Riset, Presentasi",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["PowerPoint", "PDF Reader", "Anatomy Atlas", "SPSS", "Mendeley"],
    tips: ["Laptop ringan & tipis", "Baterai tahan lama", "Layar jelas untuk baca", "Keyboard nyaman untuk mengetik"]
  },
  "teknik-sipil": {
    name: "Teknik Sipil",
    icon: "🌉",
    desc: "Struktur, Konstruksi, Analisis",
    minRam: 16,
    minStorage: 512,
    needGpu: true,
    software: ["AutoCAD", "SAP2000", "ETABS", "SketchUp", "Excel", "Revit"],
    tips: ["GPU untuk modeling 3D", "RAM besar untuk analisis", "Numpad untuk Excel", "Layar lebar untuk drawing"]
  },
  "manajemen": {
    name: "Manajemen",
    icon: "📊",
    desc: "Bisnis, Analisis, Presentasi",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["Excel", "PowerPoint", "SPSS", "Tableau", "Word", "Zoom"],
    tips: ["Laptop stylish & ringan", "Baterai untuk meeting", "Webcam bagus", "Mic jernih untuk presentasi"]
  },
  "akuntansi": {
    name: "Akuntansi",
    icon: "🧮",
    desc: "Audit, Pajak, Keuangan",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["Excel", "SAP", "Accurate", "MYOB", "Power BI", "Tally"],
    tips: ["Numpad sangat penting!", "Layar 15.6\" atau lebih", "Keyboard numerik", "RAM 8GB+ untuk Excel besar"]
  },
  "teknik-elektro": {
    name: "Teknik Elektro",
    icon: "⚡",
    desc: "Elektronika, IoT, Simulasi",
    minRam: 16,
    minStorage: 512,
    needGpu: false,
    software: ["MATLAB", "Simulink", "Proteus", "Arduino IDE", "Eagle PCB", "LabVIEW"],
    tips: ["CPU kuat untuk simulasi", "RAM besar untuk MATLAB", "Port USB banyak", "Layar jelas untuk schematic"]
  },
  "teknik-mesin": {
    name: "Teknik Mesin",
    icon: "⚙️",
    desc: "Desain Mekanik, Simulasi, CAD",
    minRam: 16,
    minStorage: 512,
    needGpu: true,
    software: ["SolidWorks", "CATIA", "ANSYS", "AutoCAD", "MATLAB", "Inventor"],
    tips: ["GPU dedicated wajib!", "Workstation class ideal", "RAM 16GB minimum", "Mouse 3D recommended"]
  },
  "ilmu-komunikasi": {
    name: "Ilmu Komunikasi",
    icon: "📢",
    desc: "Media, Jurnalistik, PR",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["Canva", "Premiere Pro", "Word", "PowerPoint", "WordPress", "CapCut"],
    tips: ["Laptop stylish", "Webcam & mic bagus", "Ringan untuk mobilitas", "Storage untuk video"]
  },
  "psikologi": {
    name: "Psikologi",
    icon: "🧠",
    desc: "Riset, Statistik, Klinis",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["SPSS", "JASP", "Excel", "PowerPoint", "Mendeley", "Zoom"],
    tips: ["Laptop standar sudah cukup", "Ringan & portable", "Keyboard nyaman", "Webcam untuk teleconference"]
  },
  "hukum": {
    name: "Hukum",
    icon: "⚖️",
    desc: "Perundangan, Riset, Dokumen",
    minRam: 8,
    minStorage: 256,
    needGpu: false,
    software: ["Word", "PDF Reader", "LexisNexis", "PowerPoint", "Excel", "Google Scholar"],
    tips: ["Keyboard sangat nyaman!", "Layar jelas untuk baca", "Baterai tahan lama", "Ringan untuk dibawa"]
  },
};

export default async function JurusanDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jurusan = JURUSAN_DATA[slug];

  if (!jurusan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="mb-4 text-3xl font-bold text-white">Jurusan Tidak Ditemukan</h1>
          <p className="mb-8 text-dark-300">Maaf, jurusan yang kamu cari tidak ada di database kami.</p>
          <Link
            href="/jurusan"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Jurusan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-dark-700/50 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/jurusan" className="mb-6 inline-flex items-center gap-2 text-sm text-dark-300 transition-colors hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Semua Jurusan
          </Link>

          {/* Hero Content */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-5xl">
              {jurusan.icon}
            </div>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white sm:text-5xl">{jurusan.name}</h1>
              <p className="text-xl text-dark-200">{jurusan.desc}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 border border-blue-500/20">
                  {jurusan.minRam}GB RAM Minimum
                </span>
                <span className="rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400 border border-green-500/20">
                  {jurusan.minStorage}GB Storage
                </span>
                {jurusan.needGpu && (
                  <span className="rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400 border border-purple-500/20">
                    GPU Dedicated
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Cards */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-white">Spesifikasi Minimum</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 transition-all hover:border-blue-500/40 hover:bg-blue-500/10">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-xl">💾</div>
              <span className="text-sm text-blue-300">RAM</span>
            </div>
            <div className="text-4xl font-bold text-blue-400">{jurusan.minRam}<span className="text-xl">GB</span></div>
            <p className="mt-1 text-sm text-blue-300/60">Minimum untuk multitasking</p>
          </div>

          <div className="group rounded-2xl border border-green-500/20 bg-green-500/5 p-6 transition-all hover:border-green-500/40 hover:bg-green-500/10">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-xl">💿</div>
              <span className="text-sm text-green-300">Storage</span>
            </div>
            <div className="text-4xl font-bold text-green-400">{jurusan.minStorage}<span className="text-xl">GB</span></div>
            <p className="mt-1 text-sm text-green-300/60">SSD recommended</p>
          </div>

          <div className="group rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 transition-all hover:border-purple-500/40 hover:bg-purple-500/10">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-xl">🎮</div>
              <span className="text-sm text-purple-300">GPU</span>
            </div>
            <div className="text-4xl font-bold text-purple-400">{jurusan.needGpu ? "Perlu" : "Opsional"}</div>
            <p className="mt-1 text-sm text-purple-300/60">{jurusan.needGpu ? "Dedicated GPU" : "Integrated enough"}</p>
          </div>

          <div className="group rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-xl">⚡</div>
              <span className="text-sm text-amber-300">CPU</span>
            </div>
            <div className="text-4xl font-bold text-amber-400">i5/R5</div>
            <p className="mt-1 text-sm text-amber-300/60">Minimum untuk performa</p>
          </div>
        </div>
      </section>

      {/* Software Used */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-white">Software yang Dipakai</h2>
        <div className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
          <div className="flex flex-wrap gap-3">
            {jurusan.software.map((s) => (
              <span
                key={s}
                className="rounded-xl border border-dark-500 bg-dark-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-primary-500/50 hover:bg-dark-600"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-white">Tips Memilih Laptop</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {jurusan.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-dark-600 bg-dark-800 p-5 transition-all hover:border-dark-500"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-sm font-bold text-primary-400">
                {i + 1}
              </div>
              <p className="text-dark-200">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-10 text-center shadow-2xl shadow-primary-500/20 sm:p-12">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <div className="mb-4 text-5xl">{jurusan.icon}</div>
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              Siap Cari Laptop untuk {jurusan.name}?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-lg text-blue-100">
              Kami sudah filter laptop yang cocok untuk jurusan kamu. Lihat rekomendasi sekarang!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href={`/search?jurusan=${slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Lihat Rekomendasi
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
              >
                <span>🤖</span>
                Tanya AI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}