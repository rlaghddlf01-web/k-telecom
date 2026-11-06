'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import ImageField from '@/components/admin/ImageField';
import { Field, Modal, Notice, Toggle, ghostBtn, inputCls, primaryBtn } from '@/components/admin/ui';
import { THEMES } from '@/lib/content/themes';
import { BANNER_POSITIONS, THEME_OPTIONS, type Banner, type BannerPosition, type ThemeKey } from '@/lib/content/types';

type Draft = Omit<Banner, 'id'> & { id?: string };

const EMPTY: Draft = {
  position: 'hero',
  title: '',
  eyebrow: '',
  description: '',
  button_label: '',
  link_url: '',
  image_url: '',
  theme: 'violet',
  sort_order: 0,
  active: true,
  starts_at: null,
  ends_at: null,
};

/** 위치마다 쓰는 입력칸이 다르다 */
const VISIBLE: Record<BannerPosition, { eyebrow: boolean; description: boolean; button: boolean; image: boolean }> = {
  top_strip: { eyebrow: false, description: false, button: false, image: false },
  hero: { eyebrow: true, description: true, button: true, image: true },
  promo: { eyebrow: false, description: true, button: true, image: true },
  showcase: { eyebrow: true, description: true, button: true, image: true },
  popup: { eyebrow: true, description: true, button: true, image: true },
};

const pad = (n: number) => String(n).padStart(2, '0');
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);

function liveStatus(b: Banner): { label: string; tone: string } {
  const now = Date.now();
  if (!b.active) return { label: '숨김', tone: 'bg-slate-200 text-slate-600' };
  if (b.starts_at && Date.parse(b.starts_at) > now) return { label: '예약', tone: 'bg-amber-100 text-amber-700' };
  if (b.ends_at && Date.parse(b.ends_at) < now) return { label: '종료', tone: 'bg-slate-200 text-slate-600' };
  return { label: '노출 중', tone: 'bg-emerald-100 text-emerald-700' };
}

export default function BannerManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<Banner[]>([]);
  const [mode, setMode] = useState<'supabase' | 'memory' | 'none'>('supabase');
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<BannerPosition>('hero');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch<{ rows?: Banner[]; mode?: 'supabase' | 'memory' | 'none' }>('/api/admin/content/banners');
    setLoading(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res, '목록을 불러오지 못했습니다.'));
    setRows(res.data.rows ?? []);
    setMode(res.data.mode ?? 'none');
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const mine = rows.filter((b) => b.position === position).sort((a, b) => a.sort_order - b.sort_order);
  const info = BANNER_POSITIONS.find((p) => p.id === position)!;

  async function run(promise: ReturnType<typeof adminFetch>, success?: string) {
    const res = await promise;
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) {
      setMessage(errorMessage(res));
      return false;
    }
    if (success) setMessage(success);
    await load();
    return true;
  }

  async function seed() {
    if (!confirm('지금 사이트에 보이는 기본 배너를 불러와서 수정할 수 있게 합니다. 진행할까요?')) return;
    await run(adminFetch('/api/admin/content/banners', jsonInit('POST', { action: 'seed' })), '기본 배너를 가져왔습니다.');
  }

  async function toggle(b: Banner) {
    await run(adminFetch('/api/admin/content/banners', jsonInit('PATCH', { id: b.id, active: !b.active })));
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= mine.length) return;
    const next = [...mine];
    [next[index], next[target]] = [next[target], next[index]];
    // 순서 번호가 겹쳐도 확실히 바뀌도록 10단위로 다시 매긴다
    for (let i = 0; i < next.length; i += 1) {
      const order = (i + 1) * 10;
      if (next[i].sort_order !== order) {
        const res = await adminFetch('/api/admin/content/banners', jsonInit('PATCH', { id: next[i].id, sort_order: order }));
        if (res.status === 401) return onUnauthorized();
        if (!res.ok) return setMessage(errorMessage(res));
      }
    }
    await load();
  }

  async function remove(b: Banner) {
    if (!confirm(`"${b.title.split('\n')[0]}" 배너를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    await run(adminFetch(`/api/admin/content/banners?id=${b.id}`, { method: 'DELETE' }), '삭제했습니다.');
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { id, ...item } = draft;
    const res = id
      ? await adminFetch('/api/admin/content/banners', jsonInit('PATCH', { id, item }))
      : await adminFetch('/api/admin/content/banners', jsonInit('POST', { item }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setDraft(null);
    setMessage('저장했습니다.');
    await load();
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d));
  const visible = draft ? VISIBLE[draft.position] : VISIBLE.hero;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">배너 관리</h1>
        <button
          className={`${primaryBtn} inline-flex items-center gap-1.5`}
          onClick={() => setDraft({ ...EMPTY, position, sort_order: (mine.length + 1) * 10 })}
        >
          <Plus className="h-3.5 w-3.5" /> 새 배너
        </button>
      </div>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 배너를 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {BANNER_POSITIONS.map((p) => {
          const count = rows.filter((b) => b.position === p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => setPosition(p.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                position === p.id ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-white text-slate-600 hover:text-brand'
              }`}
            >
              {p.label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="mb-4 text-xs text-slate-500">{info.help}</p>

      {!loading && rows.length === 0 && mode !== 'none' && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            아직 등록한 배너가 없어 <b>기본 배너</b>(지금 사이트에 보이는 것)가 표시되고 있습니다. 가져오면 모두 수정하고 순서를 바꿀 수 있습니다.
          </p>
          <button onClick={seed} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
            <Download className="h-3.5 w-3.5" /> 기본 배너 가져오기
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {mine.map((b, i) => {
          const st = liveStatus(b);
          return (
            <li key={b.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <div
                className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${THEMES[b.theme as ThemeKey]?.bg ?? THEMES.violet.bg}`}
              >
                {b.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{b.title.split('\n').join(' ')}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{b.link_url || '링크 없음'}</p>
                <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${st.tone}`}>{st.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Toggle checked={b.active} onChange={() => toggle(b)} label="노출" />
                <button aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={ghostBtn}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button aria-label="아래로" disabled={i === mine.length - 1} onClick={() => move(i, 1)} className={ghostBtn}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button aria-label="수정" onClick={() => setDraft({ ...b })} className={ghostBtn}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button aria-label="삭제" onClick={() => remove(b)} className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
        {!loading && mine.length === 0 && (
          <li className="rounded-2xl bg-white py-14 text-center text-sm text-slate-400">이 위치에 등록된 배너가 없습니다.</li>
        )}
      </ul>

      {draft && (
        <Modal
          title={draft.id ? '배너 수정' : '새 배너'}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className={ghostBtn} onClick={() => setDraft(null)}>취소</button>
              <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            </>
          }
        >
          <Field label="배너 위치">
            <select value={draft.position} onChange={(e) => set('position', e.target.value as BannerPosition)} className={inputCls}>
              {BANNER_POSITIONS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </Field>

          {visible.eyebrow && (
            <Field label="작은 문구 (제목 위)">
              <input value={draft.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} maxLength={60} className={inputCls} />
            </Field>
          )}
          <Field label="제목" hint="줄바꿈하면 화면에서도 줄이 바뀝니다.">
            <textarea value={draft.title} onChange={(e) => set('title', e.target.value)} rows={2} maxLength={120} className={inputCls} />
          </Field>
          {visible.description && (
            <Field label="설명">
              <textarea value={draft.description} onChange={(e) => set('description', e.target.value)} rows={2} maxLength={300} className={inputCls} />
            </Field>
          )}
          {visible.button && (
            <Field label="버튼 글자" hint="링크와 버튼 글자를 모두 넣어야 버튼이 보입니다.">
              <input value={draft.button_label} onChange={(e) => set('button_label', e.target.value)} maxLength={30} className={inputCls} />
            </Field>
          )}
          <Field label="클릭하면 이동할 링크" hint="사이트 안 주소는 /plans 처럼, 바깥 주소는 https://... 로 입력합니다.">
            <input value={draft.link_url} onChange={(e) => set('link_url', e.target.value)} placeholder="/plans" className={inputCls} />
          </Field>
          {visible.image && (
            <div className="text-sm font-bold">
              배너 이미지
              <ImageField value={draft.image_url} onChange={(v) => set('image_url', v)} folder="banners" onUnauthorized={onUnauthorized} />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="배경 색 테마" hint="이미지가 없을 때 배경으로 쓰입니다.">
              <select value={draft.theme} onChange={(e) => set('theme', e.target.value as ThemeKey)} className={inputCls}>
                {THEME_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="순서 번호" hint="작을수록 먼저 보입니다.">
              <input type="number" value={draft.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="노출 시작 (선택)">
              <input type="datetime-local" value={toLocalInput(draft.starts_at)} onChange={(e) => set('starts_at', fromLocalInput(e.target.value))} className={inputCls} />
            </Field>
            <Field label="노출 종료 (선택)">
              <input type="datetime-local" value={toLocalInput(draft.ends_at)} onChange={(e) => set('ends_at', fromLocalInput(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <Toggle checked={draft.active} onChange={(v) => set('active', v)} label="사이트에 노출" />
        </Modal>
      )}
    </div>
  );
}
