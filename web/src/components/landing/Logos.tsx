const BRANDS = [
  { name: "ASUS", icon: "🔵" },
  { name: "Lenovo", icon: "🔴" },
  { name: "HP", icon: "🟦" },
  { name: "Acer", icon: "🟢" },
  { name: "Apple", icon: "⚪" },
  { name: "Dell", icon: "🔵" },
  { name: "MSI", icon: "🔴" },
];

export default function Logos() {
  return (
    <section className="border-y border-edge">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-center text-sm text-ink-muted">
          Rekomendasi laptop dari brand terpercaya
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center gap-2 rounded-2xl border border-edge bg-surface px-4 py-4 transition-all hover:border-edge-hover hover:bg-surface-raised"
            >
              <span className="text-lg">{brand.icon}</span>
              <span className="text-sm font-semibold text-ink-subtle">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
