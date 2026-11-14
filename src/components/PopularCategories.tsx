import Link from '@/components/LocaleLink';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/site';
import { ht } from '@/lib/content/homeText';

// 카테고리마다 다른 색의 둥근 아이콘 (순서는 CATEGORIES 와 같다)
const TONES = [
  'from-[#60a5fa] to-[#2563eb]',
  'from-[#fb7185] to-[#e11d48]',
  'from-[#34d399] to-[#059669]',
  'from-[#38bdf8] to-[#0284c7]',
  'from-[#fbbf24] to-[#f97316]',
  'from-[#a78bfa] to-[#7c3aed]',
  'from-[#f472b6] to-[#db2777]',
];

export default function PopularCategories() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h2 className="section-title">{ht('인기 카테고리')}</h2>
      <div className="relative mt-9 rounded-[2.5rem] bg-gradient-to-r from-pill to-[#7a5cff] px-4 pb-6 pt-7 shadow-[0_18px_40px_-18px_rgba(91,79,224,0.7)] md:px-6 md:pb-5 md:pt-9">
        <span aria-hidden="true" className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white md:flex">
          <ChevronLeft className="h-4 w-4" />
        </span>
        <span aria-hidden="true" className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white md:flex">
          <ChevronRight className="h-4 w-4" />
        </span>
        <ul className="grid grid-cols-4 gap-x-2 gap-y-5 md:grid-cols-7 md:px-6">
          {CATEGORIES.map(({ label, icon: Icon, href }, i) => (
            <li key={label}>
              <Link href={href} className="group flex flex-col items-center gap-3">
                <span className={`flex h-14 w-14 items-center justify-center md:-mt-14 md:h-[68px] md:w-[68px] rounded-full bg-gradient-to-br ${TONES[i % TONES.length]} text-white ring-4 ring-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] transition-transform group-hover:-translate-y-1.5`}>
                  <Icon className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-white md:text-xs">{ht(label)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
