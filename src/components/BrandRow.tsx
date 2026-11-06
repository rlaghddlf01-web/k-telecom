const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'LG', 'Vivo', 'Oppo'];

export default function BrandRow() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-black/5 py-8">
        {BRANDS.map((b) => (
          <li key={b} className="text-xl font-black tracking-tight text-slate-300 transition-colors hover:text-ink md:text-2xl">
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
