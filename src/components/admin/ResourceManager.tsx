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

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">{ui.title}</h1>
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

      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li key={row.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{String(row[ui.titleKey] ?? '').split('\n').join(' ')}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{ui.subKeys.map((k) => display(k, row[k])).filter(Boolean).join(' · ')}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Toggle
                checked={row.active !== false}
                onChange={() => run(adminFetch(api, jsonInit('PATCH', { id: row.id, active: row.active === false })))}
                label="노출"
              />
              {!ui.byDate && (
                <>
                  <button aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={ghostBtn}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label="아래로" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className={ghostBtn}>
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
        ))}
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
