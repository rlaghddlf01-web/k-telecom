'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import { Notice, Toggle, ghostBtn, inputCls, primaryBtn } from '@/components/admin/ui';
import { HOME_SECTIONS, HOME_TEXT_GROUPS, resolveOrder, type HomeSettings } from '@/lib/content/home';

type Mode = 'supabase' | 'memory' | 'none';
const labelOf = (id: string) => HOME_SECTIONS.find((s) => s.id === id)?.label ?? id;

/** 홈 화면: 구역 순서·노출, 구역별 문구 바꾸기 (배너·상품·공지 등은 각자의 탭에서 관리) */
export default function HomeManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [home, setHome] = useState<HomeSettings | null>(null);
  const [mode, setMode] = useState<Mode>('supabase');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const res = await adminFetch<{ value?: HomeSettings; mode?: Mode }>('/api/admin/home');
    if (res.status === 401) return onUnauthorized();
    if (!res.ok || !res.data.value) return setMessage(errorMessage(res, '설정을 불러오지 못했습니다.'));
    setHome({ ...res.data.value, order: resolveOrder(res.data.value) });
    setMode(res.data.mode ?? 'none');
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!home) return;
    setSaving(true);
    setMessage('');
    const res = await adminFetch('/api/admin/home', jsonInit('PUT', { value: home }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setMessage('저장했습니다. 사이트에 바로 반영됩니다.');
    await load();
  }

  if (!home) return <p className="py-10 text-center text-sm text-slate-400">{message || '불러오는 중...'}</p>;

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= home.order.length) return;
    const order = [...home.order];
    [order[index], order[target]] = [order[target], order[index]];
    setHome({ ...home, order });
  };
  const toggle = (id: string, visible: boolean) =>
    setHome({ ...home, hidden: visible ? home.hidden.filter((x) => x !== id) : [...home.hidden, id] });
  const setText = (from: string, to: string) => setHome({ ...home, texts: { ...home.texts, [from]: to } });

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">홈 화면</h1>
        <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        맨 위 슬라이드는 항상 첫 번째입니다. 배너는 [배너], 상품은 [상품], 요금제·공지·FAQ는 각 탭에서 관리하고, 여기서는 구역의 순서·노출과 제목·안내 문구를 바꿉니다.
      </p>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-black">구역 순서와 노출</h2>
        <ul className="space-y-2">
          {home.order.map((id, i) => (
            <li key={id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="w-6 text-xs font-bold text-slate-400">{i + 1}</span>
              <span className={`mr-auto text-sm font-bold ${home.hidden.includes(id) ? 'text-slate-400 line-through' : ''}`}>{labelOf(id)}</span>
              <Toggle checked={!home.hidden.includes(id)} onChange={(v) => toggle(id, v)} label="노출" />
              <button aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={ghostBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button aria-label="아래로" disabled={i === home.order.length - 1} onClick={() => move(i, 1)} className={ghostBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-black">구역 문구</h2>
        <p className="mb-3 text-xs text-slate-500">칸을 비워 두면 기본 문구가 나옵니다. 같은 문구(예: 전체 보기)는 쓰인 곳 모두에서 함께 바뀝니다.</p>
        <div className="space-y-5">
          {HOME_TEXT_GROUPS.map(({ group, texts }) => (
            <div key={group} className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xs font-black text-slate-500">{group}</h3>
              <div className="space-y-2">
                {texts.map((from) => (
                  <label key={from} className="block">
                    <span className="mb-0.5 block text-[11px] text-slate-400">{from}</span>
                    <input
                      className={inputCls}
                      value={home.texts[from] ?? ''}
                      maxLength={200}
                      placeholder={from}
                      onChange={(e) => setText(from, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
