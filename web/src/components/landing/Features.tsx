import SectionHeader from "@/components/ui/SectionHeader";

const FEATURES = [
  {
    num: "01",
    title: "Jurusan-Aware",
    desc: "Rekomendasi berdasarkan kebutuhan spesifik jurusan kuliah kamu. Kami tahu software apa yang dipakai di setiap jurusan.",
    icon: "🎯",
  },
  {
    num: "02",
    title: "Budget-Friendly",
    desc: "Filter berdasarkan budget yang kamu miliki, dari 3 juta hingga 40 juta. Tidak ada laptop di luar budget.",
    icon: "💰",
  },
  {
    num: "03",
    title: "AI-Powered",
    desc: "Dapatkan rekomendasi cerdas dengan alasan yang jelas dari AI. Bukan sekadar perbandingan spec.",
    icon: "🤖",
  },
  {
    num: "04",
    title: "Real-time Price",
    desc: "Harga dari Tokopedia dan Shopee yang selalu update. Bandingkan harga dari berbagai marketplace.",
    icon: "📊",
  },
  {
    num: "05",
    title: "Compare Mode",
    desc: "Bandingkan hingga 3 laptop sekaligus. Lihat perbedaan spec dan harga secara visual.",
    icon: "⚖️",
  },
  {
    num: "06",
    title: "Vector Search",
    desc: "Cari dengan bahasa natural. Ketik kebutuhanmu, AI akan pahami dan carikan laptop yang tepat.",
    icon: "🔍",
  },
];

export default function Features() {
  return (
    <section className="border-t border-edge">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionHeader
          label="Fitur"
          title="Bukan sekadar perbandingan spec"
          description="KulPik membantu kamu menemukan laptop yang tepat berdasarkan jurusan, budget, dan kebutuhan spesifik."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-edge bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-edge-hover hover:shadow-card-hover"
            >
              {/* Top accent */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="rounded-full bg-surface-overlay px-3 py-1 text-2xs font-bold text-ink-faint">
                  {item.num}
                </span>
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-subtle">{item.desc}</p>

              {/* Hover accent line */}
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
