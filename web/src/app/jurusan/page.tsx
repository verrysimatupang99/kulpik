import Link from "next/link";

const JURUSAN_LIST = [
  { slug: "teknik-informatika", name: "Teknik Informatika", icon: "💻", minRam: 16, minStorage: 512, needGpu: false, desc: "Butuh laptop cepat untuk compile code, run VM, dan development. RAM 16GB minimum." },
  { slug: "desain-komunikasi-visual", name: "Desain Komunikasi Visual", icon: "🎨", minRam: 16, minStorage: 512, needGpu: true, desc: "Butuh layar akurat, GPU untuk Photoshop/Illustrator, dan storage besar untuk aset." },
  { slug: "arsitektur", name: "Arsitektur", icon: "🏗️", minRam: 16, minStorage: 512, needGpu: true, desc: "AutoCAD, SketchUp, Lumion butuh GPU dedicated dan RAM besar untuk render." },
  { slug: "kedokteran", name: "Kedokteran", icon: "🩺", minRam: 8, minStorage: 256, needGpu: false, desc: "Fokus pada ringan dan baterai tahan lama. Banyak presentasi dan baca PDF." },
  { slug: "teknik-sipil", name: "Teknik Sipil", icon: "🌉", minRam: 16, minStorage: 512, needGpu: true, desc: "SAP2000, ETABS, AutoCAD butuh performa tinggi dan GPU." },
  { slug: "manajemen", name: "Manajemen", icon: "📊", minRam: 8, minStorage: 256, needGpu: false, desc: "Office, presentasi, dan analisis data. Laptop ringan dan baterai awet." },
  { slug: "akuntansi", name: "Akuntansi", icon: "🧮", minRam: 8, minStorage: 256, needGpu: false, desc: "Excel besar, software akuntansi. Numpad penting, layar cukup besar." },
  { slug: "teknik-elektro", name: "Teknik Elektro", icon: "⚡", minRam: 16, minStorage: 512, needGpu: false, desc: "MATLAB, Simulink, PCB design software. Butuh CPU kuat dan RAM cukup." },
  { slug: "teknik-mesin", name: "Teknik Mesin", icon: "⚙️", minRam: 16, minStorage: 512, needGpu: true, desc: "SolidWorks, CATIA, ANSYS. Butuh GPU dedicated dan RAM 16GB+." },
  { slug: "ilmu-komunikasi", name: "Ilmu Komunikasi", icon: "📢", minRam: 8, minStorage: 256, needGpu: false, desc: "Video editing ringan, presentasi, social media. Laptop stylish dan ringan." },
  { slug: "psikologi", name: "Psikologi", icon: "🧠", minRam: 8, minStorage: 256, needGpu: false, desc: "Riset, statistik (SPSS), presentasi. Laptop standar sudah cukup." },
  { slug: "hukum", name: "Hukum", icon: "⚖️", minRam: 8, minStorage: 256, needGpu: false, desc: "Banyak mengetik dan membaca dokumen. Keyboard nyaman dan layar jelas." },
];

export default function JurusanPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Pilih Jurusan</h1>
      <p className="mb-8 text-gray-600">
        Setiap jurusan punya kebutuhan laptop yang beda. Pilih jurusan kamu untuk dapat rekomendasi yang tepat.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {JURUSAN_LIST.map((j) => (
          <Link
            key={j.slug}
            href={`/jurusan/${j.slug}`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md"
          >
            <div className="mb-3 text-4xl">{j.icon}</div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
              {j.name}
            </h2>
            <p className="mb-4 text-sm text-gray-600">{j.desc}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                RAM {j.minRam}GB+
              </span>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">
                Storage {j.minStorage}GB+
              </span>
              {j.needGpu && (
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-700">
                  GPU Dedicated
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
