'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import { NETWORKS, PLANS, type Network } from '@/lib/plans';
import { t } from '@/lib/i18n';

type Sort = 'recommended' | 'priceAsc' | 'priceDesc' | 'dataDesc';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'recommended', label: '추천순' },
  { id: 'priceAsc', label: '낮은가격순' },
  { id: 'priceDesc', label: '높은가격순' },
  { id: 'dataDesc', label: '데이터 많은순' },
];

const DATA_NEEDS: { value: number; label: string }[] = [
  { value: 0, label: '상관없음' },
  { value: 3, label: '3GB 이상' },
  { value: 10, label: '10GB 이상' },
  { value: 20, label: '20GB 이상' },
  { value: 999, label: '무제한' },
];

const PAGE_SIZE = 6;

export default function PlanExplorer() {
  const [network, setNetwork] = useState<Network | 'all'>('all');
  const [sort, setSort] = useState<Sort>('recommended');
  const [dataNeed, setDataNeed] = useState(0);
  const [intl, setIntl] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [finderOpen, setFinderOpen] = useState(false);
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const filtered = PLANS.filter(
      (p) =>
        (network === 'all' || p.network === network) &&
        p.dataGB >= dataNeed &&
        (!intl || p.features.includes('무료 국제통화 패키지')) &&
        (maxPrice === 0 || p.promoPrice <= maxPrice),
    );
    const sorted = [...filtered];
    if (sort === 'priceAsc') sorted.sort((a, b) => a.promoPrice - b.promoPrice);
    if (sort === 'priceDesc') sorted.sort((a, b) => b.promoPrice - a.promoPrice);
    if (sort === 'dataDesc') sorted.sort((a, b) => b.dataGB - a.dataGB);
    return sorted;
  }, [network, sort, dataNeed, intl, maxPrice]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const change = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div>
      {/* 나에게 딱 맞는 요금제 찾기 */}
      <section className="rounded-2xl bg-soft p-5">
        <button
          onClick={() => setFinderOpen((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-black"
          aria-expanded={finderOpen}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" /> {t('나에게 딱 맞는 요금제 찾기')}
          </span>
          <span className="text-xs font-bold text-slate-400">{finderOpen ? t('닫기') : t('열기')}</span>
        </button>

        {finderOpen && (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label className="block text-xs font-bold">
              {t('필요한 데이터')}
              <select
                value={dataNeed}
                onChange={(e) => change(setDataNeed)(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                {DATA_NEEDS.map((d) => (
                  <option key={d.value} value={d.value}>{t(d.label)}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold">
              {t('월 희망 요금')}
              <select
                value={maxPrice}
                onChange={(e) => change(setMaxPrice)(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value={0}>{t('상관없음')}</option>
                <option value={20000}>{t('2만원 이하')}</option>
                <option value={30000}>{t('3만원 이하')}</option>
                <option value={40000}>{t('4만원 이하')}</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-2.5 text-sm font-bold">
              <input type="checkbox" checked={intl} onChange={(e) => change(setIntl)(e.target.checked)} />
              {t('무료 국제통화 포함')}
            </label>
          </div>
        )}
      </section>

      {/* 필터 · 정렬 */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', ...NETWORKS] as const).map((n) => (
            <button
              key={n}
              onClick={() => change(setNetwork)(n)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                network === n ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-soft text-slate-600 hover:text-brand'
              }`}
            >
              {n === 'all' ? t('전체') : n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <p className="text-slate-500">
            {t('총')} <b className="text-brand">{list.length}</b>
            {t('개')}
          </p>
          <select
            value={sort}
            onChange={(e) => change(setSort)(e.target.value as Sort)}
            aria-label={t('정렬')}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-brand"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{t(s.label)}</option>
            ))}
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-20 text-center text-sm text-slate-400">{t('조건에 맞는 요금제가 없습니다.')}</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id}>
              <PlanCard plan={p} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="pagination">
          <button
            onClick={() => setPage(Math.max(1, current - 1))}
            disabled={current === 1}
            className="rounded-full p-2 disabled:opacity-30"
            aria-label={t('이전')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={n === current}
              className={`h-8 w-8 rounded-full text-xs font-bold ${n === current ? 'bg-brand text-white' : 'hover:bg-soft'}`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(pages, current + 1))}
            disabled={current === pages}
            className="rounded-full p-2 disabled:opacity-30"
            aria-label={t('다음')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
