'use client';

import { useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { inputClass } from '@/components/formStyles';
import { useT } from '@/components/LangProvider';
import { DATA_PRODUCTS, VOICE_AMOUNTS, type RechargeKind } from '@/lib/recharge';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function RechargeForm() {
  const t = useT();
  const [kind, setKind] = useState<RechargeKind>('data');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.get('phone'), kind, item: form.get('item'), agree: form.get('agree') === 'on' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'request failed');
      }
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error && err.message !== 'request failed' ? err.message : t('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'));
      setStatus('error');
    }
  }

  const warning = (
    <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800 ring-1 ring-amber-200">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{t('입금은 문자로 받은 프리티 계좌로만 해 주세요. 다른 계좌로 보내 달라는 연락은 따르지 마세요.')}</span>
    </p>
  );

  if (status === 'done') {
    return (
      <div className="space-y-4 rounded-3xl bg-soft p-8 text-center md:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="text-xl font-black">{t('충전 요청이 접수되었습니다')}</h2>
        <p className="text-sm text-slate-600">{t('담당자가 확인한 뒤 입력하신 번호로 프리티 입금 계좌를 문자로 보내 드립니다. 문자를 받으면 안내된 프리티 계좌로 입금해 주세요.')}</p>
        <p className="text-xs text-slate-500">{t('문자가 오지 않으면 번호가 맞는지 확인한 뒤 다시 요청하거나 채팅으로 문의해 주세요.')}</p>
        <div className="text-left">{warning}</div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-soft p-6 md:p-8">
      <label className="block text-sm font-bold">
        {t('충전할 휴대폰 번호')} <span className="text-brand">*</span>
        <input name="phone" type="tel" inputMode="numeric" required maxLength={13} placeholder="010-0000-0000" className={inputClass} />
        <span className="mt-1 block text-xs font-medium text-slate-500">{t('프리티 가입자 번호만 충전할 수 있습니다. 가입자 번호가 아니면 문자가 가지 않습니다.')}</span>
      </label>

      <fieldset>
        <legend className="text-sm font-bold">{t('충전 종류')}</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {([['data', '데이터 충전 (30일 상품)'], ['voice', '음성 충전 (잔액)']] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${kind === k ? 'border-brand bg-brand text-white' : 'border-black/10 bg-white text-slate-600 hover:border-brand'}`}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-bold" key={kind}>
        {kind === 'data' ? t('상품') : t('충전 금액')} <span className="text-brand">*</span>
        <select name="item" required defaultValue="" className={inputClass}>
          <option value="" disabled>{t('선택해 주세요')}</option>
          {kind === 'data'
            ? DATA_PRODUCTS.map((p) => <option key={p} value={p}>{t(p)}</option>)
            : VOICE_AMOUNTS.map((a) => <option key={a} value={a}>{a.toLocaleString('ko-KR')}원</option>)}
        </select>
      </label>

      {warning}
      <p className="text-xs text-slate-500">{t('결제 정보나 카드·계좌번호는 이 화면에서 받지 않습니다.')}</p>

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input name="agree" type="checkbox" required className="mt-0.5" />
        <span>{t('충전 요청 개인정보(휴대폰 번호) 수집·이용에 동의합니다. 충전 안내 문자를 보내는 데만 쓰입니다.')}</span>
      </label>

      {error && <p className="text-sm font-semibold text-brand">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'sending' ? t('전송 중...') : t('충전 요청하기')}
      </button>
    </form>
  );
}
