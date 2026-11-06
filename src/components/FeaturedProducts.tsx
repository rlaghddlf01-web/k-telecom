import Link from '@/components/LocaleLink';
import ProductImage from '@/components/ProductImage';
import type { Phone } from '@/lib/phones';
import { ht } from '@/lib/content/homeText';

export default function FeaturedProducts({ phones }: { phones: Phone[] }) {
  const main = phones.slice(0, 6);
  const rec = [phones[5], phones[2], phones[4], phones[0]].filter((p): p is Phone => Boolean(p));
  if (main.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="section-title">{ht('추천 상품')}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2.4fr_1fr]">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {main.map((p) => (
            <li key={p.id}>
              <Link
                href={`/phones/item/${p.id}`}
                className="relative block rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
              >
                {p.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {ht(p.badge)}
                  </span>
                )}
                <div className="flex h-48 items-center justify-center">
                  <ProductImage phone={p} className="h-44 drop-shadow-[0_16px_16px_rgba(15,20,36,0.25)]" />
                </div>
                <p className="mt-3 text-[11px] font-semibold text-slate-400">{ht(p.tag)}</p>
                <h3 className="mt-1 text-sm font-bold leading-snug">{ht(p.title)}</h3>
                <p className="mt-2 text-sm font-black text-brand">{ht(p.price)}</p>
              </Link>
            </li>
          ))}
        </ul>

        <aside className="rounded-3xl bg-navy p-5 text-white">
          <h3 className="text-lg font-black">{ht('추천')}</h3>
          <p className="mt-1 text-xs text-white/55">{ht('가장 많이 선택하는 구성입니다')}</p>
          <ul className="mt-5 space-y-3">
            {rec.map((p, i) => (
              <li key={`${p.id}-${i}`}>
                <Link
                  href={`/phones/item/${p.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-white/90">
                    <ProductImage phone={p} className="h-14" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{ht(p.title)}</p>
                    <p className="mt-1 text-xs font-black text-pink-400">{ht(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/phones" className="mt-5 block rounded-md bg-brand py-3 text-center text-xs font-extrabold hover:bg-brand-dark transition-colors">
            {ht('전체 상품 보기')}
          </Link>
        </aside>
      </div>
    </section>
  );
}
