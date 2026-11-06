'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProductImage from '@/components/ProductImage';
import type { Phone, PhoneGroup } from '@/lib/phones';

const TABS: { id: PhoneGroup | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'galaxy', label: '삼성 갤럭시' },
  { id: 'iphone', label: '애플 아이폰' },
];

/** texts: 서버(홈)에서 관리자가 바꾼 문구를 반영해 미리 만든 글자 (기본 문장 → 표시할 글자) */
export default function BestProducts({ phones, texts }: { phones: Phone[]; texts: Record<string, string> }) {
  const t = (key: string) => texts[key] ?? key;
  const [tab, setTab] = useState<PhoneGroup | 'all'>('all');
  const list = phones.filter((p) => tab === 'all' || p.group === tab).slice(0, 5);

  if (phones.length === 0) return null;

  return (
    <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
      <div className="rounded-[2.5rem] bg-soft px-4 py-12 md:px-10">
        <div className="flex items-end justify-between">
          <h2 className="section-title">{t('인기 스마트폰')}</h2>
          <Link href="/phones" className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-brand">
            {t('전체 보기')}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
                tab === item.id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-white text-slate-600 hover:text-brand'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        <ul className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-5">
          {list.map((p) => (
            <li key={p.id}>
              <Link
                href={`/phones/item/${p.id}`}
                className="relative block rounded-2xl bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-xl"
              >
                {p.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {t(p.badge)}
                  </span>
                )}
                <div className="flex h-44 items-center justify-center">
                  <ProductImage phone={p} className="h-40 drop-shadow-[0_14px_14px_rgba(15,20,36,0.25)]" />
                </div>
                <p className="mt-3 text-[11px] font-semibold text-slate-400">{t(p.tag)}</p>
                <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-snug">{t(p.title)}</h3>
                <p className="mt-2 text-sm font-black text-brand">{t(p.price)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
