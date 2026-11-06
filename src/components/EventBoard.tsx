'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Gift } from 'lucide-react';
import type { Post } from '@/lib/boards';
import { t } from '@/lib/i18n';

type Tab = 'event' | 'winner';

interface Props {
  events: Post[];
  winners: Post[];
}

export default function EventBoard({ events, winners }: Props) {
  const [tab, setTab] = useState<Tab>('event');
  const [q, setQ] = useState('');

  const source = tab === 'event' ? events : winners;
  const list = source.filter((p) => p.title.includes(q.trim()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex gap-2">
          {([['event', '이벤트'], ['winner', '당첨자발표']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
                tab === id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-soft text-slate-600 hover:text-brand'
              }`}
            >
              {t(label)}
            </button>
          ))}
        </div>
        <label className="relative">
          <span className="sr-only">{t('검색')}</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('검색')}
            className="w-56 rounded-full border border-black/10 py-2 pl-4 pr-10 text-sm outline-none focus:border-brand"
          />
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-sm text-slate-400">
          {q ? t('검색 결과가 없습니다.') : t('등록된 내용이 없습니다.')}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <li key={p.id}>
              <Link
                href={`/events/${p.id}`}
                className="group block overflow-hidden rounded-2xl ring-1 ring-black/10 transition-shadow hover:shadow-xl"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#1b1550] to-brand">
                  <Gift className="h-12 w-12 text-white/70 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-extrabold leading-snug">{t(p.title)}</h3>
                  <p className="mt-2 text-xs text-slate-400">{p.period ?? p.date}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
