'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProductImage from '@/components/ProductImage';
import { PHONES, type PhoneGroup } from '@/lib/phones';
import { t } from '@/lib/i18n';

const TABS: { id: PhoneGroup | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'galaxy', label: '삼성 갤럭시' },
  { id: 'iphone', label: '애플 아이폰' },
];

export default function PhonesCatalog() {
  const [tab, setTab] = useState<PhoneGroup | 'all'>('all');
  const list = PHONES.filter((p) => tab === 'all' || p.group === tab);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
                tab === item.id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-soft text-slate-600 hover:text-brand'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {t('총')} <b className="text-brand">{list.length}</b>
          {t('개 상품')}
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              href={`/phones/item/${p.id}`}
              className="relative block rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
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
  );
}
