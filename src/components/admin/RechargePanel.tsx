'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, CreditCard } from 'lucide-react';

type Req = { id: string; created_at: string; phone: string; message: string; status: string };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

/** "[충전요청:데이터] 선불데이터 안심 (36,000원)" → { kind, item } */
function split(message: string) {
  const m = message.match(/^\[충전요청:([^\]]+)\]\s*([\s\S]*)$/);
  return m ? { kind: m[1], item: m[2] } : { kind: '충전', item: message };
}

const dashed = (p: string) => (p.length === 11 ? `${p.slice(0, 3)}-${p.slice(3, 7)}-${p.slice(7)}` : p);

/**
 * 선불 충전 요청: 고객이 남긴 번호와 상품이 오래된 순으로 나온다.
 * 사장님이 프리티 판매점 화면(충전 > 선불데이터충전 / 음성충전)에서 번호를 넣고 "freeT 고객 가상계좌 전송"을 누른 뒤
 * 여기서 "문자 전송 완료"를 누르면 목록에서 사라진다. (예치금으로 "충전" 버튼은 누르지 않는다)
 */
export default function RechargePanel({ onUnauthorized, onChanged }: { onUnauthorized: () => void; onChanged: () => void }) {
  const [rows, setRows] = useState<Req[]>([]);
  const [busy, setBusy] = useState('');
  const [copied, setCopied] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/submissions?recharge=1')
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

  async function mark(id: string, status: 'contacted' | 'done' | 'cancelled') {
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

  async function copy(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(phone);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      /* 복사가 막힌 브라우저에서는 화면의 번호를 직접 선택해 복사 */
    }
  }

  if (rows.length === 0) return null;

  return (
    <section className="mb-6 rounded-2xl bg-sky-50 p-4 ring-2 ring-sky-300">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sky-800">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-sm font-black">선불 충전 요청 <span className="ml-1 rounded-full bg-sky-600 px-2 py-0.5 text-[11px] text-white">{rows.length}</span></h2>
        <span className="text-xs font-medium text-sky-700/80">프리티 판매점 화면에서 번호를 넣고 "freeT 고객 가상계좌 전송"을 누르세요 (예치금 "충전" 버튼은 누르지 않습니다)</span>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => {
          const { kind, item } = split(r.message);
          return (
            <li key={r.id} className="rounded-xl bg-white p-3 text-sm shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-extrabold text-white">{kind} 충전</span>
                <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>
                {r.status === 'contacted' && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">처리 중</span>}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-lg font-black tracking-wide">{dashed(r.phone)}</span>
                <button onClick={() => copy(r.phone)} className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-bold hover:bg-slate-50">
                  <Copy className="h-3.5 w-3.5" /> {copied === r.phone ? '복사됨' : '번호 복사'}
                </button>
              </div>
              <p className="mt-1 font-bold text-slate-800">{item}</p>
              <div className="mt-3 flex gap-2">
                {r.status === 'new' && (
                  <button disabled={busy === r.id} onClick={() => mark(r.id, 'contacted')} className="rounded-full border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-50">
                    처리 중으로
                  </button>
                )}
                <button disabled={busy === r.id} onClick={() => mark(r.id, 'cancelled')} className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  처리 불가(가입자 아님 등)
                </button>
                <button disabled={busy === r.id} onClick={() => mark(r.id, 'done')} className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                  <Check className="h-3.5 w-3.5" /> 문자 전송 완료
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
