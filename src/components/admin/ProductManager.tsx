'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import PhoneMockup, { type PhoneKind } from '@/components/PhoneMockup';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import ImageField from '@/components/admin/ImageField';
import { Field, Modal, Notice, Toggle, ghostBtn, inputCls, primaryBtn } from '@/components/admin/ui';

interface ProductRow {
  id?: string;
  grp: 'galaxy' | 'iphone' | 'budget';
  tag: string;
  title: string;
  price: string;
  note: string;
  badge: string;
  description: string;
  image_url: string;
  kind: PhoneKind;
  color_from: string;
  color_to: string;
  sort_order: number;
  active: boolean;
  /** 사양 표 (DB 에는 [[항목, 값], ...] 로 저장) */
  specs?: [string, string][];
  /** 입력 양식에서만 쓰는 글자: 한 줄에 "항목 | 값" */
  specs_text?: string;
  official_url?: string;
  is_new?: boolean;
}

const specsToText = (specs?: [string, string][]) => (specs ?? []).map(([k, v]) => `${k} | ${v}`).join('\n');

const EMPTY: ProductRow = {
  grp: 'galaxy',
  tag: '',
  title: '',
  price: '',
  note: '',
  badge: '',
  description: '',
  image_url: '',
  kind: 'punch',
  color_from: '#6d5dfc',
  color_to: '#e8174f',
  sort_order: 0,
  active: true,
  specs_text: '',
  official_url: '',
  is_new: false,
};

const GROUPS: Record<ProductRow['grp'], string> = { galaxy: '삼성 갤럭시', iphone: '애플 아이폰', budget: '기타' };
const KINDS: Record<PhoneKind, string> = { punch: '펀치홀형(전면)', island: '아이폰형(전면)', back: '후면(카메라)' };

function Thumb({ p }: { p: ProductRow }) {
  return (
    <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
      {p.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image_url} alt="" className="h-full w-full object-contain" />
      ) : (
        <PhoneMockup kind={p.kind} from={p.color_from} to={p.color_to} className="h-14" />
      )}
    </div>
  );
}

export default function ProductManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [mode, setMode] = useState<'supabase' | 'memory' | 'none'>('supabase');
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<ProductRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch<{ rows?: ProductRow[]; mode?: 'supabase' | 'memory' | 'none' }>('/api/admin/content/products');
    setLoading(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res, '목록을 불러오지 못했습니다.'));
    setRows((res.data.rows ?? []).sort((a, b) => a.sort_order - b.sort_order));
    setMode(res.data.mode ?? 'none');
  }, [onUnauthorized]);

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

  async function seed() {
    if (!confirm('지금 사이트에 보이는 기본 상품을 불러와서 수정할 수 있게 합니다. 진행할까요?')) return;
    await run(adminFetch('/api/admin/content/products', jsonInit('POST', { action: 'seed' })), '기본 상품을 가져왔습니다.');
  }

  async function toggle(p: ProductRow) {
    await run(adminFetch('/api/admin/content/products', jsonInit('PATCH', { id: p.id, active: !p.active })));
  }

  /** 맨 위로: 지금 가장 작은 순서 번호보다 작게 만든다 */
  async function toTop(index: number) {
    if (index === 0) return;
    const first = Math.min(...rows.map((r) => r.sort_order));
    const res = await adminFetch('/api/admin/content/products', jsonInit('PATCH', { id: rows[index].id, sort_order: Math.max(-9999, first - 10) }));
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    await load();
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const a = next[index].sort_order;
    const b = next[target].sort_order;
    if (a !== b) {
      for (const [row, order] of [[next[index], b], [next[target], a]] as const) {
        const res = await adminFetch('/api/admin/content/products', jsonInit('PATCH', { id: row.id, sort_order: order }));
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) return setMessage(errorMessage(res));
      }
      return load();
    }
    [next[index], next[target]] = [next[target], next[index]];
    for (let i = 0; i < next.length; i += 1) {
      const order = (i + 1) * 10;
      if (next[i].sort_order !== order) {
        const res = await adminFetch('/api/admin/content/products', jsonInit('PATCH', { id: next[i].id, sort_order: order }));
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) return setMessage(errorMessage(res));
      }
    }
    await load();
  }

  async function remove(p: ProductRow) {
    if (!confirm(`"${p.title}" 상품을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    await run(adminFetch(`/api/admin/content/products?id=${p.id}`, { method: 'DELETE' }), '삭제했습니다.');
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { id, specs_text, specs: _specs, ...rest } = draft;
    const item = { ...rest, specs: specs_text ?? '' };
    const res = id
      ? await adminFetch('/api/admin/content/products', jsonInit('PATCH', { id, item }))
      : await adminFetch('/api/admin/content/products', jsonInit('POST', { item }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setDraft(null);
    setMessage('저장했습니다.');
    await load();
  }

  const set = <K extends keyof ProductRow>(key: K, value: ProductRow[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">상품 관리 (스마트폰)</h1>
        {mode !== 'none' && (
          <button
            onClick={async () => {
              setMessage('번역을 만들고 저장하는 중입니다. 1~2분 걸릴 수 있습니다...');
              const res = await adminFetch<{ languages?: number; texts?: number; stored?: number }>('/api/admin/translate', jsonInit('POST', { resource: 'products' }));
              if (res.status === 401) return onUnauthorized();
              setMessage(res.ok ? `번역을 저장했습니다. (문구 ${res.data.texts ?? 0}개 × ${res.data.languages ?? 0}개 언어)` : errorMessage(res));
            }}
            className={`${ghostBtn} inline-flex items-center gap-1.5`}
          >
            번역 미리 만들기
          </button>
        )}
        {rows.length > 0 && mode !== 'none' && (
          <button
            onClick={() => {
              if (confirm(`지금 등록된 상품 ${rows.length}개를 모두 지우고, 프리티 홈페이지 기준 기본 휴대폰으로 바꿉니다.\n직접 수정한 내용은 사라집니다. 진행할까요?`)) {
                run(adminFetch('/api/admin/content/products', jsonInit('POST', { action: 'replace' })), '기본 상품으로 바꿨습니다.');
              }
            }}
            className={`${ghostBtn} inline-flex items-center gap-1.5`}
          >
            <Download className="h-3.5 w-3.5" /> 기본 상품으로 교체
          </button>
        )}
        <button className={`${primaryBtn} inline-flex items-center gap-1.5`} onClick={() => setDraft({ ...EMPTY, sort_order: (rows.length + 1) * 10 })}>
          <Plus className="h-3.5 w-3.5" /> 새 상품
        </button>
      </div>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 상품을 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      {!loading && rows.length === 0 && mode !== 'none' && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            아직 등록한 상품이 없어 <b>기본 상품</b>(지금 사이트에 보이는 것)이 표시되고 있습니다. 가져오면 모두 수정하고 순서를 바꿀 수 있습니다.
            새 상품을 먼저 등록하면 기본 상품은 사라지고 등록한 상품만 보입니다.
          </p>
          <button onClick={seed} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
            <Download className="h-3.5 w-3.5" /> 기본 상품 가져오기
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {rows.map((p, i) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <Thumb p={p} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{p.title}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {GROUPS[p.grp]} · {p.price || '가격 문구 없음'}
                {p.badge && <> · <span className="font-bold text-brand">{p.badge}</span></>}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-1.5 sm:w-auto sm:flex-nowrap">
              <Toggle checked={p.active} onChange={() => toggle(p)} label="노출" />
              <button aria-label="맨 위로" title="맨 위로" disabled={i === 0} onClick={() => toTop(i)} className={`${ghostBtn} whitespace-nowrap text-[11px] font-bold`}>
                맨위
              </button>
              <button aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={ghostBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button aria-label="아래로" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className={ghostBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button aria-label="수정" onClick={() => setDraft({ ...p, specs_text: specsToText(p.specs), official_url: p.official_url ?? '', is_new: p.is_new ?? false })} className={ghostBtn}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button aria-label="삭제" onClick={() => remove(p)} className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
        {!loading && rows.length === 0 && (
          <li className="rounded-2xl bg-white py-14 text-center text-sm text-slate-400">등록된 상품이 없습니다.</li>
        )}
      </ul>

      {draft && (
        <Modal
          title={draft.id ? '상품 수정' : '새 상품'}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className={ghostBtn} onClick={() => setDraft(null)}>취소</button>
              <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            </>
          }
        >
          <Field label="상품명">
            <input value={draft.title} onChange={(e) => set('title', e.target.value)} maxLength={100} placeholder="갤럭시 A시리즈 미개봉 신제품" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="분류" hint="홈의 탭(삼성/애플)과 단말 목록의 탭에 쓰입니다.">
              <select value={draft.grp} onChange={(e) => set('grp', e.target.value as ProductRow['grp'])} className={inputCls}>
                {Object.entries(GROUPS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="브랜드 문구" hint="상품명 위의 작은 글자">
              <input value={draft.tag} onChange={(e) => set('tag', e.target.value)} maxLength={40} placeholder="삼성 갤럭시" className={inputCls} />
            </Field>
            <Field label="가격 문구" hint="숫자가 아니라 보여줄 문구 그대로 표시됩니다.">
              <input value={draft.price} onChange={(e) => set('price', e.target.value)} maxLength={60} placeholder="기기값 0원" className={inputCls} />
            </Field>
            <Field label="부가 설명 (짧게)">
              <input value={draft.note} onChange={(e) => set('note', e.target.value)} maxLength={120} placeholder="24개월 통신요금 합산 청구" className={inputCls} />
            </Field>
            <Field label="배지" hint="예: 신제품, 인기, 추천 (12자 이내)">
              <input value={draft.badge} onChange={(e) => set('badge', e.target.value)} maxLength={12} className={inputCls} />
            </Field>
            <Field label="순서 번호" hint="작을수록 먼저 보입니다.">
              <input type="number" value={draft.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <Field label="상세 설명" hint="상품 상세 페이지에 보입니다. 줄바꿈이 그대로 표시됩니다.">
            <textarea value={draft.description} onChange={(e) => set('description', e.target.value)} rows={4} maxLength={2000} className={inputCls} />
          </Field>
          <Field
            label="사양 표"
            hint="한 줄에 하나씩 「항목 | 값」으로 적습니다. 예) 배터리 | 5,000mAh. 항목 이름은 18개 언어로 보이고, 값은 숫자·영문 그대로 모든 언어에 보입니다. 값에 한글이 있으면 자동 번역해서 저장해 둡니다."
          >
            <textarea
              value={draft.specs_text ?? ''}
              onChange={(e) => set('specs_text', e.target.value)}
              rows={7}
              maxLength={4000}
              placeholder={'화면 크기 | 6.9"\n배터리 | 5,000mAh\n무게 | 214g'}
              className={`${inputCls} font-mono text-xs`}
            />
          </Field>
          <Field label="제조사 공식 페이지 주소" hint="https:// 로 시작하는 주소. 상세 페이지 아래에 「공식 페이지에서 자세히 보기」 링크로 나옵니다.">
            <input value={draft.official_url ?? ''} onChange={(e) => set('official_url', e.target.value)} maxLength={300} placeholder="https://www.samsung.com/..." className={inputCls} />
          </Field>
          <Toggle checked={draft.is_new ?? false} onChange={(v) => set('is_new', v)} label="새 제품 (상품 구성 안내를 보여 줍니다)" />
          <div className="text-sm font-bold">
            상품 사진
            <ImageField value={draft.image_url} onChange={(v) => set('image_url', v)} folder="products" onUnauthorized={onUnauthorized} />
          </div>

          <div className="rounded-2xl bg-soft p-4">
            <p className="text-sm font-bold">사진이 없을 때 보이는 폰 그림</p>
            <div className="mt-3 flex flex-wrap items-center gap-5">
              <PhoneMockup kind={draft.kind} from={draft.color_from} to={draft.color_to} className="h-28" />
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                <Field label="모양">
                  <select value={draft.kind} onChange={(e) => set('kind', e.target.value as PhoneKind)} className={inputCls}>
                    {Object.entries(KINDS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field label="색 1">
                  <input type="color" value={draft.color_from} onChange={(e) => set('color_from', e.target.value)} className={`${inputCls} h-10 cursor-pointer p-1`} />
                </Field>
                <Field label="색 2">
                  <input type="color" value={draft.color_to} onChange={(e) => set('color_to', e.target.value)} className={`${inputCls} h-10 cursor-pointer p-1`} />
                </Field>
              </div>
            </div>
          </div>
          <Toggle checked={draft.active} onChange={(v) => set('active', v)} label="사이트에 노출" />
        </Modal>
      )}
    </div>
  );
}
