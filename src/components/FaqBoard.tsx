'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { FAQ_CATEGORIES, FAQS } from '@/lib/faq';
import { t } from '@/lib/i18n';

export default function FaqBoard() {
  const [cat, setCat] = useState<(typeof FAQ_CATEGORIES)[number]>('전체');
  const [q, setQ] = useState('');

  const keyword = q.trim();
  const list = FAQS.filter(
    (f) => (cat === '전체' || f.category === cat) && (!keyword || f.q.includes(keyword) || f.a.includes(keyword)),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex flex-wrap gap-2">
          {FAQ_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                cat === c ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-soft text-slate-600 hover:text-brand'
              }`}
            >
              {t(c)}
            </button>
          ))}
        </div>
        <label className="relative">
          <span className="sr-only">{t('검색')}</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('검색')}
            className="w-52 rounded-full border border-black/10 py-2 pl-4 pr-10 text-sm outline-none focus:border-brand"
          />
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-sm text-slate-400">{t('검색 결과가 없습니다.')}</p>
      ) : (
        <ul className="mt-4 divide-y divide-black/5 rounded-2xl ring-1 ring-black/10">
          {list.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold">
                  <span>
                    <span className="mr-2 text-[11px] font-extrabold text-slate-400">{t(f.category)}</span>
                    <span className="mr-2 text-brand">Q</span>
                    {t(f.q)}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="bg-soft px-5 py-4 text-sm leading-relaxed text-slate-600">{t(f.a)}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
