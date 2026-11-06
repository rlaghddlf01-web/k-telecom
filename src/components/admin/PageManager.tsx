'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import SchemaForm, { type FormValue } from '@/components/admin/SchemaForm';
import { Field, Modal, Notice, inputCls, ghostBtn, primaryBtn } from '@/components/admin/ui';
import { PAGE_BLOCKS_FIELD, type FieldDef } from '@/lib/content/schema';

type Mode = 'supabase' | 'memory' | 'none';
type Kind = 'registry' | 'dedicated' | 'custom';

interface PageItem {
  path: string;
  kind: Kind;
  edited: boolean;
  active: boolean;
  title: string;
  lead: string;
  defaultTitle: string;
}

const KIND_LABEL: Record<Kind, string> = {
  registry: '안내 페이지',
  dedicated: '기능 화면 (제목·설명만)',
  custom: '직접 만든 페이지',
};

const META_FIELDS: FieldDef[] = [
  { kind: 'text', key: 'title', label: '페이지 제목', max: 60, required: true },
  { kind: 'text', key: 'lead', label: '제목 아래 설명 (선택)', max: 300, multiline: true },
  { kind: 'toggle', key: 'active', label: '사이트에 보이기' },
];

/** 서브 페이지의 제목·설명·본문을 관리하는 화면 */
export default function PageManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [mode, setMode] = useState<Mode>('supabase');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<{ path: string; kind: Kind; isNew: boolean; value: FormValue } | null>(null);
  const [newPath, setNewPath] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch<{ pages?: PageItem[]; mode?: Mode }>('/api/admin/pages');
    setLoading(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res, '목록을 불러오지 못했습니다.'));
    setPages(res.data.pages ?? []);
    setMode(res.data.mode ?? 'none');
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function open(p: PageItem) {
    const res = await adminFetch<{ page?: Record<string, unknown> }>(`/api/admin/pages?path=${encodeURIComponent(p.path)}`);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok || !res.data.page) return setMessage(errorMessage(res, '페이지를 불러오지 못했습니다.'));
    const { title, lead, active, blocks } = res.data.page;
    setDraft({ path: p.path, kind: p.kind, isNew: false, value: { title, lead, active, blocks } });
  }

  function startNew() {
    const path = newPath.trim();
    if (!path.startsWith('/')) return setMessage('주소는 / 로 시작해야 합니다. 예: /company-news');
    setDraft({ path, kind: 'custom', isNew: true, value: { title: '', lead: '', active: true, blocks: [] } });
    setNewPath('');
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    const body = { path: draft.path, ...draft.value };
    const res = await adminFetch(`/api/admin/pages`, jsonInit('PUT', draft.kind === 'dedicated' ? { ...body, blocks: undefined } : body));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setDraft(null);
    setMessage('저장했습니다.');
    await load();
  }

  async function remove(p: PageItem) {
    const text = p.kind === 'custom' ? '이 페이지를 삭제할까요? 되돌릴 수 없습니다.' : '수정한 내용을 버리고 처음 내용으로 되돌릴까요?';
    if (!confirm(text)) return;
    const res = await adminFetch(`/api/admin/pages?path=${encodeURIComponent(p.path)}`, { method: 'DELETE' });
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setMessage(p.kind === 'custom' ? '삭제했습니다.' : '처음 내용으로 되돌렸습니다.');
    await load();
  }

  const fields: FieldDef[] = draft && draft.kind !== 'dedicated' ? [...META_FIELDS, PAGE_BLOCKS_FIELD] : META_FIELDS;

  return (
    <div>
      <h1 className="mb-2 text-lg font-black">페이지</h1>
      <p className="mb-4 text-xs text-slate-500">
        사이트의 안내 페이지와 기능 화면의 제목·설명·본문을 수정하고, 새 페이지도 만들 수 있습니다. 새 페이지는 메뉴에 자동으로 붙지 않으니 [헤더·푸터] 에서 메뉴에 주소를 추가해 주세요.
      </p>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <div className="min-w-[220px] flex-1">
          <Field label="새 페이지 주소" hint="영문 소문자·숫자·-·_ 만 가능. 예: /company-news">
            <input className={inputCls} value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="/company-news" />
          </Field>
        </div>
        <button className={`${primaryBtn} inline-flex items-center gap-1.5`} onClick={startNew}>
          <Plus className="h-3.5 w-3.5" /> 새 페이지 만들기
        </button>
      </div>

      {(['registry', 'dedicated', 'custom'] as Kind[]).map((kind) => {
        const list = pages.filter((p) => p.kind === kind);
        if (list.length === 0) return null;
        return (
          <section key={kind} className="mb-6">
            <h2 className="mb-2 text-xs font-black text-slate-500">{KIND_LABEL[kind]}</h2>
            <ul className="space-y-2">
              {list.map((p) => (
                <li key={p.path} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">
                      {p.title}
                      {p.edited && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">수정됨</span>}
                      {!p.active && <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">숨김</span>}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{p.path}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a href={p.path} target="_blank" rel="noreferrer" aria-label="사이트에서 보기" className={ghostBtn}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button aria-label="수정" onClick={() => open(p)} className={ghostBtn}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {(p.edited || p.kind === 'custom') && (
                      <button
                        aria-label={p.kind === 'custom' ? '삭제' : '처음 내용으로 되돌리기'}
                        onClick={() => remove(p)}
                        className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}
                      >
                        {p.kind === 'custom' ? <Trash2 className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {!loading && pages.length === 0 && <p className="rounded-2xl bg-white py-14 text-center text-sm text-slate-400">페이지가 없습니다.</p>}

      {draft && (
        <Modal
          title={`${draft.path} ${draft.isNew ? '새로 만들기' : '수정'}`}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className={ghostBtn} onClick={() => setDraft(null)}>취소</button>
              <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            </>
          }
        >
          {draft.kind === 'dedicated' && (
            <p className="mb-3 text-xs text-slate-500">목록·신청서 같은 기능 화면이라 제목과 설명 문구만 바꿀 수 있습니다.</p>
          )}
          <SchemaForm fields={fields} value={draft.value} onChange={(value) => setDraft({ ...draft, value })} />
        </Modal>
      )}
    </div>
  );
}
