'use client';

import { useCallback, useEffect, useState } from 'react';
import { BellRing, Check } from 'lucide-react';

type Urgent = { id: string; created_at: string; name: string; phone: string; message: string; status: string };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

/** "[긴급:유심 미배송] 내용" → { label, text } */
function split(message: string) {
  const m = message.match(/^\[긴급:([^\]]+)\]\s*([\s\S]*)$/);
  return m ? { label: m[1], text: m[2] } : { label: '긴급', text: message };
}

/**
 * 긴급 알림: AI 상담사(김서연)가 "사장님이 꼭 알아야 할 일"(유심 미배송, 유심 인식 불가 등)을 올리면 여기 맨 위에 빨갛게 나타난다.
 * 처리 중·처리 완료로 표시하면 목록에서 사라진다 (상담문의 목록에는 그대로 남음).
 */
export default function UrgentPanel({ onUnauthorized, onChanged }: { onUnauthorized: () => void; onChanged: () => void }) {
  const [rows, setRows] = useState<Urgent[]>([]);
  const [busy, setBusy] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/submissions?urgent=1')
      .then((r) => {
        if (r.status === 401) {
          onUnauthorized();
          return null;
        }
        return r.json();
      })
      .then((d) => d && setRows(Array.isArray(d.rows) ? d.rows : []))
      .catch(() => undefined);
  }, [onUnauthorized]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  async function mark(id: string, status: 'contacted' | 'done') {
    setBusy(id);
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'inquiry', id, status }),
      });
    } finally {
      setBusy('');
      load();
      onChanged();
    }
  }

  if (rows.length === 0) return null;
  const fresh = rows.filter((r) => r.status === 'new').length;

  return (
    <section className="mb-6 rounded-2xl bg-rose-50 p-4 ring-2 ring-rose-300">
      <div className="mb-3 flex items-center gap-2 text-rose-700">
        <BellRing className="h-5 w-5" />
        <h2 className="text-sm font-black">긴급 알림 {fresh > 0 && <span className="ml-1 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] text-white">새 {fresh}</span>}</h2>
        <span className="text-xs font-medium text-rose-600/80">AI 상담사가 꼭 알려야 한다고 올린 건입니다</span>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => {
          const { label, text } = split(r.message);
          return (
            <li key={r.id} className="rounded-xl bg-white p-3 text-sm shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-extrabold text-white">{label}</span>
                <span className="text-xs text-slate-500">{r.name} · {formatDate(r.created_at)}</span>
                {r.status === 'contacted' && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">처리 중</span>}
              </div>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed">{text}</p>
              {r.phone && r.phone !== '-' && <p className="mt-1 text-xs font-bold text-slate-600">고객이 남긴 연락처: {r.phone}</p>}
              <div className="mt-3 flex gap-2">
                {r.status === 'new' && (
                  <button disabled={busy === r.id} onClick={() => mark(r.id, 'contacted')} className="rounded-full border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-50">
                    처리 중으로
                  </button>
                )}
                <button disabled={busy === r.id} onClick={() => mark(r.id, 'done')} className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                  <Check className="h-3.5 w-3.5" /> 처리 완료
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
