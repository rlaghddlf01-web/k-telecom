'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import { Field, Notice, ghostBtn, inputCls, primaryBtn } from '@/components/admin/ui';
import type { FooterSettings, HeaderSettings, MenuEntry, NavLink, SettingKey } from '@/lib/content/types';

// ---------------------------------------------------------------------------
// 링크 목록 편집기 (이름 + 주소, 순서 이동, 삭제)
// ---------------------------------------------------------------------------
function LinkListEditor({
  items,
  onChange,
  max,
  addLabel,
}: {
  items: NavLink[];
  onChange: (items: NavLink[]) => void;
  max: number;
  addLabel: string;
}) {
  const update = (i: number, patch: Partial<NavLink>) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };

  return (
    <div className="mt-1.5 space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={it.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="이름"
            aria-label="이름"
            maxLength={30}
            className={`${inputCls} !mt-0 w-36 shrink-0`}
          />
          <input
            value={it.href}
            onChange={(e) => update(i, { href: e.target.value })}
            placeholder="/plans 또는 https://..."
            aria-label="링크"
            className={`${inputCls} !mt-0 min-w-0 flex-1`}
          />
          <button type="button" aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={ghostBtn}>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="아래로" disabled={i === items.length - 1} onClick={() => move(i, 1)} className={ghostBtn}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="삭제"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { label: '', href: '' }])} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function HeaderEditor({ value, onChange }: { value: HeaderSettings; onChange: (v: HeaderSettings) => void }) {
  const setMenu = (menu: MenuEntry[]) => onChange({ ...value, menu });
  const updateEntry = (i: number, patch: Partial<MenuEntry>) => setMenu(value.menu.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const moveEntry = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= value.menu.length) return;
    const next = [...value.menu];
    [next[i], next[t]] = [next[t], next[i]];
    setMenu(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="로고 글자">
          <input value={value.logoText} onChange={(e) => onChange({ ...value, logoText: e.target.value })} maxLength={30} className={inputCls} />
        </Field>
        <Field label="오른쪽 위 버튼 글자" hint="비우면 버튼이 숨겨집니다.">
          <input value={value.ctaLabel} onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })} maxLength={20} className={inputCls} />
        </Field>
        <Field label="오른쪽 위 버튼 링크">
          <input value={value.ctaHref} onChange={(e) => onChange({ ...value, ctaHref: e.target.value })} placeholder="/partnership" className={inputCls} />
        </Field>
      </div>

      <div>
        <p className="text-sm font-bold">상단 작은 메뉴 (최대 6개)</p>
        <LinkListEditor items={value.utility} onChange={(utility) => onChange({ ...value, utility })} max={6} addLabel="작은 메뉴 추가" />
      </div>

      <div>
        <p className="text-sm font-bold">메인 메뉴 (최대 8개)</p>
        <p className="mt-1 text-xs text-slate-400">메인 메뉴에 마우스를 올리면 하위 메뉴가 펼쳐집니다. 하위 메뉴가 하나도 없으면 펼침 메뉴는 보이지 않습니다.</p>
        <div className="mt-3 space-y-4">
          {value.menu.map((m, i) => (
            <div key={i} className="rounded-2xl bg-soft p-4">
              <div className="flex items-center gap-2">
                <input
                  value={m.label}
                  onChange={(e) => updateEntry(i, { label: e.target.value })}
                  placeholder="메뉴 이름"
                  aria-label="메뉴 이름"
                  maxLength={20}
                  className={`${inputCls} !mt-0 w-36 shrink-0 font-bold`}
                />
                <input
                  value={m.href}
                  onChange={(e) => updateEntry(i, { href: e.target.value })}
                  placeholder="메뉴 링크"
                  aria-label="메뉴 링크"
                  className={`${inputCls} !mt-0 min-w-0 flex-1`}
                />
                <button type="button" aria-label="위로" disabled={i === 0} onClick={() => moveEntry(i, -1)} className={ghostBtn}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" aria-label="아래로" disabled={i === value.menu.length - 1} onClick={() => moveEntry(i, 1)} className={ghostBtn}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="메뉴 삭제"
                  onClick={() => setMenu(value.menu.filter((_, idx) => idx !== i))}
                  className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-3 text-xs font-bold text-slate-500">하위 메뉴 (최대 10개)</p>
              <LinkListEditor items={m.children} onChange={(children) => updateEntry(i, { children })} max={10} addLabel="하위 메뉴 추가" />
            </div>
          ))}
          {value.menu.length < 8 && (
            <button type="button" onClick={() => setMenu([...value.menu, { label: '', href: '', children: [] }])} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
              <Plus className="h-3.5 w-3.5" /> 메인 메뉴 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function FooterEditor({ value, onChange }: { value: FooterSettings; onChange: (v: FooterSettings) => void }) {
  const company = value.company;
  const setCompany = (patch: Partial<FooterSettings['company']>) => onChange({ ...value, company: { ...company, ...patch } });

  return (
    <div className="space-y-6">
      <Field label="푸터 소개 문구">
        <input value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} maxLength={200} className={inputCls} />
      </Field>

      <div>
        <p className="text-sm font-bold">회사 정보</p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <Field label="상호"><input value={company.name} onChange={(e) => setCompany({ name: e.target.value })} maxLength={60} className={inputCls} /></Field>
          <Field label="대표자"><input value={company.ceo} onChange={(e) => setCompany({ ceo: e.target.value })} maxLength={30} className={inputCls} /></Field>
          <Field label="사업자등록번호"><input value={company.bizNumber} onChange={(e) => setCompany({ bizNumber: e.target.value })} maxLength={30} placeholder="000-00-00000" className={inputCls} /></Field>
          <Field label="통신판매업 신고번호"><input value={company.salesNumber} onChange={(e) => setCompany({ salesNumber: e.target.value })} maxLength={60} className={inputCls} /></Field>
          <Field label="전화번호 (고객센터)" hint="홈의 고객센터와 푸터에 보입니다.">
            <input value={company.phone} onChange={(e) => setCompany({ phone: e.target.value })} maxLength={30} className={inputCls} />
          </Field>
          <Field label="이메일"><input value={company.email} onChange={(e) => setCompany({ email: e.target.value })} maxLength={80} className={inputCls} /></Field>
        </div>
        <div className="mt-4">
          <Field label="주소"><input value={company.address} onChange={(e) => setCompany({ address: e.target.value })} maxLength={150} className={inputCls} /></Field>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold">푸터 링크 (최대 10개)</p>
        <LinkListEditor items={value.links} onChange={(links) => onChange({ ...value, links })} max={10} addLabel="링크 추가" />
      </div>
      <div>
        <p className="text-sm font-bold">이용자 보호 링크 (최대 10개)</p>
        <LinkListEditor items={value.publicLinks} onChange={(publicLinks) => onChange({ ...value, publicLinks })} max={10} addLabel="링크 추가" />
      </div>

      <Field label="맨 아래 저작권 문구" hint="비우면 '© 올해 상호. All Rights Reserved.'가 자동으로 들어갑니다.">
        <input value={value.copyright} onChange={(e) => onChange({ ...value, copyright: e.target.value })} maxLength={100} className={inputCls} />
      </Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function SiteSettingsManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [part, setPart] = useState<SettingKey>('header');
  const [header, setHeader] = useState<HeaderSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [mode, setMode] = useState<'supabase' | 'memory' | 'none'>('supabase');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(
    async (key: SettingKey) => {
      const res = await adminFetch<{ value?: HeaderSettings | FooterSettings; mode?: 'supabase' | 'memory' | 'none' }>(`/api/admin/settings?key=${key}`);
      if (res.status === 401) return onUnauthorized();
      if (!res.ok || !res.data.value) return setMessage(errorMessage(res, '설정을 불러오지 못했습니다.'));
      setMode(res.data.mode ?? 'none');
      if (key === 'header') setHeader(res.data.value as HeaderSettings);
      else setFooter(res.data.value as FooterSettings);
    },
    [onUnauthorized],
  );

  useEffect(() => {
    load('header');
    load('footer');
  }, [load]);

  async function save() {
    const value = part === 'header' ? header : footer;
    if (!value) return;
    setSaving(true);
    setMessage('');
    const res = await adminFetch('/api/admin/settings', jsonInit('PUT', { key: part, value }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setMessage('저장했습니다. 사이트에 바로 반영됩니다.');
    await load(part);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">헤더·푸터 관리</h1>
        <button className={primaryBtn} onClick={save} disabled={saving || (part === 'header' ? !header : !footer)}>
          {saving ? '저장 중...' : `${part === 'header' ? '헤더' : '푸터'} 저장`}
        </button>
      </div>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      <div className="mb-5 flex gap-2">
        {(['header', 'footer'] as const).map((k) => (
          <button
            key={k}
            onClick={() => {
              setPart(k);
              setMessage('');
            }}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
              part === k ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-white text-slate-600 hover:text-brand'
            }`}
          >
            {k === 'header' ? '헤더 (맨 위 메뉴)' : '푸터 (맨 아래 정보)'}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        {part === 'header' ? (
          header ? <HeaderEditor value={header} onChange={setHeader} /> : <p className="py-10 text-center text-sm text-slate-400">불러오는 중...</p>
        ) : footer ? (
          <FooterEditor value={footer} onChange={setFooter} />
        ) : (
          <p className="py-10 text-center text-sm text-slate-400">불러오는 중...</p>
        )}
      </div>
    </div>
  );
}
