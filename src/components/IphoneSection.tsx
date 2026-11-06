import Link from '@/components/LocaleLink';
import PhoneMockup from '@/components/PhoneMockup';
import ProductImage from '@/components/ProductImage';
import type { Phone } from '@/lib/phones';
import { ht } from '@/lib/content/homeText';

export default function IphoneSection({ phones }: { phones: Phone[] }) {
  const list = phones.filter((p) => p.group === 'iphone').slice(0, 4);
  const more = phones.filter((p) => p.group === 'galaxy').slice(0, 4);
  const grid = [...list, ...more];
  if (grid.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between">
        <h2 className="section-title">{ht('정품 검수 리퍼비시 아이폰')}</h2>
        <Link href="/phones" className="text-xs font-bold text-slate-500 hover:text-brand underline underline-offset-4">
          {ht('전체 보기')}
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-[0.8fr_2.2fr]">
        <article className="relative flex min-h-[420px] flex-col items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-b from-[#1b1550] via-[#2b1b6b] to-[#e8174f] p-6 text-center text-white">
          <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-fuchsia-400/40 blur-3xl" />
          <PhoneMockup kind="island" from="#111827" to="#6d5dfc" className="relative mt-6 h-64 drop-shadow-[0_26px_30px_rgba(0,0,0,0.5)]" />
          <div className="relative">
            <h3 className="text-xl font-black">{ht('아이폰 12 / 13 / 14')}</h3>
            <p className="mt-1 text-xs text-white/75">{ht('S급 정품 검수 · 초기비용 0원')}</p>
            <Link href="/plans/apply" className="mt-4 inline-flex rounded-md bg-white px-5 py-2 text-xs font-extrabold text-ink">
              {ht('지금 신청')}
            </Link>
          </div>
        </article>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {grid.map((p, i) => (
            <li key={`${p.id}-${i}`}>
              <Link
                href={`/phones/item/${p.id}`}
                className="block rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
              >
                <div className="flex h-36 items-center justify-center">
                  <ProductImage phone={p} className="h-32 drop-shadow-[0_12px_12px_rgba(15,20,36,0.25)]" />
                </div>
                <p className="mt-3 text-[11px] font-semibold text-slate-400">{ht(p.tag)}</p>
                <h3 className="mt-1 line-clamp-2 min-h-[2.4rem] text-xs font-bold leading-snug">{ht(p.title)}</h3>
                <p className="mt-2 text-xs font-black text-brand">{ht(p.price)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
