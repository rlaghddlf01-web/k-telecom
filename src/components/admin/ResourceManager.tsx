'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import SchemaForm, { type FormValue } from '@/components/admin/SchemaForm';
import { Modal, Notice, Toggle, ghostBtn, primaryBtn } from '@/components/admin/ui';
import type { ResourceUi } from '@/lib/content/schema';

type Mode = 'supabase' | 'memory' | 'none';
type ResourceName = 'plans' | 'events' | 'notices' | 'faqs';
type Row = FormValue & { id: string };

const display = (key: string, v: unknown): string => {
  if (v === null || v === undefined || v === '') return '';
  if (key.endsWith('price') && typeof v === 'number') return `${v.toLocaleString('ko-KR')}원`;
  return Array.isArray(v) ? v.join(', ') : String(v);
};

/** 요금제·이벤트·공지·자주 묻는 질문처럼 "목록 + 입력 양식" 으로 관리하는 항목을 위한 공통 화면 */
export default function ResourceManager({
  resource,
  ui,
  onUnauthorized,
}: {
  resource: ResourceName;
  ui: ResourceUi;
  onUnauthorized: () => void;
}) {
  const api = `/api/admin/content/${resource}`;
  const [rows, setRows] = useState<Row[]>([]);
  const [mode, setMode] = useState<Mode>('supabase');
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<FormValue | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch<{ rows?: Row[]; mode?: Mode }>(api);
    setLoading(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res, '목록을 불러오지 못했습니다.'));
    setRows(res.data.rows ?? []);
    setMode(res.data.mode ?? 'none');
  }, [api, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(promise: ReturnType<typeof adminFetch>, success?: string) {
    const res = await promise;
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    if (success) setMessage(success);
    await load();
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    // 두 항목의 순서 번호만 맞바꾸면 되므로 (번호가 서로 다를 때) 요청 2번으로 끝난다
    const a = Number(next[index].sort_order);
    const b = Number(next[target].sort_order);
    if (a !== b) {
      for (const [row, order] of [[next[index], b], [next[target], a]] as const) {
        const res = await adminFetch(api, jsonInit('PATCH', { id: row.id, sort_order: order }));
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) return setMessage(errorMessage(res));
      }
      return load();
    }
    [next[index], next[target]] = [next[target], next[index]];
    for (let i = 0; i < next.length; i += 1) {
      const order = (i + 1) * 10;
      if (Number(next[i].sort_order) !== order) {
        const res = await adminFetch(api, jsonInit('PATCH', { id: next[i].id, sort_order: order }));
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) return setMessage(errorMessage(res));
      }
    }
    await load();
  }

  /** 맨 위로: 지금 가장 작은 순서 번호보다 작게 만든다 */
  async function toTop(index: number) {
    if (index === 0) return;
    const first = Math.min(...rows.map((r) => Number(r.sort_order) || 0));
    const res = await adminFetch(api, jsonInit('PATCH', { id: rows[index].id, sort_order: Math.max(-9999, first - 10) }));
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    await load();
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { id, ...item } = draft as FormValue & { id?: string };
    const res = id
      ? await adminFetch(api, jsonInit('PATCH', { id, item }))
      : await adminFetch(api, jsonInit('POST', { item }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setDraft(null);
    setMessage('저장했습니다.');
    await load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const [search, setSearch] = useState('');
  const keyword = search.trim().toLowerCase();
  const [sortBy, setSortBy] = useState<'order' | 'priceAsc' | 'priceDesc' | 'dataDesc' | 'signups'>('order');
  const [netFilter, setNetFilter] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const isPlans = resource === 'plans';
  useEffect(() => {
    if (!isPlans) return;
    adminFetch<{ counts?: Record<string, number> }>('/api/admin/submissions?planCounts=1').then((res) => {
      if (res.ok) setCounts(res.data.counts ?? {});
    });
  }, [isPlans]);
  const signups = (r: Row) => counts[String(r.name ?? '')] ?? 0;
  // 정렬·필터를 쓰는 동안에는 위·아래 이동을 막는다 (화면 순서가 실제 순서가 아니므로)
  const reordering = !keyword && sortBy === 'order' && !netFilter;
  let visible = rows.filter(
    (r) =>
      (!keyword || `${r[ui.titleKey] ?? ''} ${ui.subKeys.map((k) => display(k, r[k])).join(' ')}`.toLowerCase().includes(keyword)) &&
      (!netFilter || r.network === netFilter),
  );
  if (isPlans && sortBy !== 'order') {
    const num = (r: Row, k: string) => Number(r[k] ?? 0);
    visible = [...visible].sort((a, b) =>
      sortBy === 'priceAsc' ? num(a, 'promo_price') - num(b, 'promo_price') :
      sortBy === 'priceDesc' ? num(b, 'promo_price') - num(a, 'promo_price') :
      sortBy === 'dataDesc' ? num(b, 'data_gb') - num(a, 'data_gb') :
      signups(b) - signups(a) || num(a, 'promo_price') - num(b, 'promo_price'));
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">{ui.title}</h1>
        {resource === 'plans' && mode !== 'none' && (
          <button
            onClick={async () => {
              setMessage('번역을 만들고 저장하는 중입니다. 1~2분 걸릴 수 있습니다...');
              const res = await adminFetch<{ languages?: number; texts?: number }>('/api/admin/translate', jsonInit('POST', { resource: 'plans' }));
              if (res.status === 401) return onUnauthorized();
              setMessage(res.ok ? `번역을 저장했습니다. (문구 ${res.data.texts ?? 0}개 × ${res.data.languages ?? 0}개 언어)` : errorMessage(res));
            }}
            className={`${ghostBtn} inline-flex items-center gap-1.5`}
          >
            번역 미리 만들기
          </button>
        )}
        {resource === 'plans' && rows.length > 0 && mode !== 'none' && (
          <button
            onClick={() => {
              if (
                confirm(
                  `지금 등록된 요금제 ${rows.length}개를 모두 지우고, 프리티 홈페이지 기준 기본 요금제로 바꿉니다.\n직접 수정한 내용은 사라집니다. 진행할까요?`,
                )
              ) {
                run(adminFetch(api, jsonInit('POST', { action: 'replace' })), '기본 요금제로 바꿨습니다.');
              }
            }}
            className={`${ghostBtn} inline-flex items-center gap-1.5`}
          >
            <Download className="h-3.5 w-3.5" /> 기본 요금제로 교체
          </button>
        )}
        <button
          className={`${primaryBtn} inline-flex items-center gap-1.5`}
          onClick={() => setDraft({ ...ui.empty, published_at: ui.empty.published_at === '' ? today : ui.empty.published_at, sort_order: (rows.length + 1) * 10 })}
        >
          <Plus className="h-3.5 w-3.5" /> 새로 등록
        </button>
      </div>
      <p className="mb-4 text-xs text-slate-500">{ui.help}</p>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      {!loading && rows.length === 0 && mode !== 'none' && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">{ui.seedHelp} 새 항목을 먼저 등록하면 기본 내용은 사라지고 등록한 내용만 보입니다.</p>
          <button
            onClick={() => {
              if (confirm('지금 사이트에 보이는 기본 내용을 불러와서 수정할 수 있게 합니다. 진행할까요?')) {
                run(adminFetch(api, jsonInit('POST', { action: 'seed' })), '기본 내용을 가져왔습니다.');
              }
            }}
            className={`${ghostBtn} inline-flex items-center gap-1.5`}
          >
            <Download className="h-3.5 w-3.5" /> 기본 내용 가져오기
          </button>
        </div>
      )}

      {isPlans && rows.length > 1 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} aria-label="정렬" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand">
            <option value="order">내가 정한 순서</option>
            <option value="priceAsc">낮은 가격순</option>
            <option value="priceDesc">높은 가격순</option>
            <option value="dataDesc">데이터 많은순</option>
            <option value="signups">가입 많은순</option>
          </select>
          <select value={netFilter} onChange={(e) => setNetFilter(e.target.value)} aria-label="통신망" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand">
            <option value="">통신망 전체</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LGU+">LG U+</option>
          </select>
          {sortBy !== 'order' && <span className="text-xs text-slate-400">정렬 중에는 위·아래 이동이 꺼집니다. "내가 정한 순서"로 돌아가면 이동할 수 있습니다.</span>}
        </div>
      )}

      {rows.length > 12 && (
        <div className="mb-3 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·통신망으로 찾기"
            aria-label="목록 검색"
            className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <span className="whitespace-nowrap text-xs text-slate-400">{keyword ? `${visible.length} / ${rows.length}개` : `${rows.length}개`}</span>
        </div>
      )}

      <ul className="space-y-3">
        {visible.map((row) => {
          const i = rows.indexOf(row);
          return (
          <li key={row.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{String(row[ui.titleKey] ?? '').split('\n').join(' ')}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{ui.subKeys.map((k) => display(k, row[k])).filter(Boolean).join(' · ')}</p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-1.5 sm:w-auto sm:flex-nowrap">
              <Toggle
                checked={row.active !== false}
                onChange={() => run(adminFetch(api, jsonInit('PATCH', { id: row.id, active: row.active === false })))}
                label="노출"
              />
              {!ui.byDate && (
                <>
                  <button aria-label="맨 위로" title="맨 위로" disabled={i === 0 || !reordering} onClick={() => toTop(i)} className={`${ghostBtn} whitespace-nowrap text-[11px] font-bold`}>
                    맨위
                  </button>
                  <button aria-label="위로" disabled={i === 0 || !reordering} onClick={() => move(i, -1)} className={ghostBtn}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label="아래로" disabled={i === rows.length - 1 || !reordering} onClick={() => move(i, 1)} className={ghostBtn}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button aria-label="수정" onClick={() => setDraft({ ...row })} className={ghostBtn}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="삭제"
                onClick={() => {
                  if (confirm('삭제할까요? 되돌릴 수 없습니다.')) run(adminFetch(`${api}?id=${row.id}`, { method: 'DELETE' }), '삭제했습니다.');
                }}
                className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
          );
        })}
        {!loading && rows.length === 0 && <li className="rounded-2xl bg-white py-14 text-center text-sm text-slate-400">등록된 내용이 없습니다.</li>}
      </ul>

      {draft && (
        <Modal
          title={(draft as { id?: string }).id ? '수정' : '새로 등록'}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className={ghostBtn} onClick={() => setDraft(null)}>취소</button>
              <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            </>
          }
        >
          <SchemaForm fields={ui.fields} value={draft} onChange={setDraft} />
        </Modal>
      )}
    </div>
  );
}
