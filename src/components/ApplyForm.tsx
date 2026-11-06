'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { inputClass } from '@/components/formStyles';
import { NETWORKS, PLANS, findPlan, won, type Network } from '@/lib/plans';
import { t } from '@/lib/i18n';

type Status = 'idle' | 'sending' | 'done' | 'error';

function Choice({
  name, options, value, onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-1.5 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
            value === o.value ? 'border-brand bg-brand text-white' : 'border-black/10 bg-white text-slate-600 hover:border-brand'
          }`}
        >
          {t(o.label)}
        </button>
      ))}
    </div>
  );
}

export default function ApplyForm() {
  const params = useSearchParams();
  const initialPlan = findPlan(params.get('plan') ?? '');

  const [joinType, setJoinType] = useState('new');
  const [network, setNetwork] = useState<Network>(initialPlan?.network ?? 'SKT');
  const [billing, setBilling] = useState('post');
  const [planId, setPlanId] = useState(initialPlan?.id ?? '');
  const [sim, setSim] = useState('usim');
  const [simBuy, setSimBuy] = useState('buy');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const plans = useMemo(() => PLANS.filter((p) => p.network === network), [network]);
  const selected = findPlan(planId);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      setError(t('요금제를 선택해 주세요.'));
      return;
    }
    const form = new FormData(e.currentTarget);
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          joinType, network, billing, planId, sim, simBuy,
          name: form.get('name'),
          nationality: form.get('nationality'),
          phone: form.get('phone'),
          email: form.get('email'),
          wishNumber: form.get('wishNumber'),
          currentNumber: form.get('currentNumber'),
          agree: form.get('agree') === 'on',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'request failed');
      }
      setStatus('done');
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'request failed'
          ? err.message
          : t('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      );
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-soft p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 text-xl font-black">{t('가입 신청이 접수되었습니다')}</h2>
        <p className="mt-2 text-sm text-slate-500">{t('상담원이 연락드려 본인 확인과 개통을 안내합니다. 전화를 받지 못하면 접수가 취소될 수 있습니다.')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <section className="space-y-5 rounded-3xl bg-soft p-6">
          <h2 className="text-base font-black">{t('가입정보')}</h2>

          <div>
            <p className="text-sm font-bold">{t('가입유형')}</p>
            <Choice name="join" value={joinType} onChange={setJoinType}
              options={[{ value: 'new', label: '신규가입' }, { value: 'port', label: '번호이동' }]} />
          </div>

          <div>
            <p className="text-sm font-bold">{t('통신망')}</p>
            <Choice name="network" value={network}
              onChange={(v) => { setNetwork(v as Network); setPlanId(''); }}
              options={NETWORKS.map((n) => ({ value: n, label: n }))} />
          </div>

          <div>
            <p className="text-sm font-bold">{t('상품유형')}</p>
            <Choice name="billing" value={billing} onChange={setBilling}
              options={[{ value: 'post', label: '후불' }, { value: 'pre', label: '선불' }]} />
          </div>

          <label className="block text-sm font-bold">
            {t('요금제')} <span className="text-brand">*</span>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} required className={inputClass}>
              <option value="" disabled>{t('요금제 선택')}</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {t(p.name)} · {t('월')} {won(p.promoPrice)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold">{t('SIM 유형')}</p>
              <Choice name="sim" value={sim} onChange={setSim}
                options={[{ value: 'usim', label: 'USIM' }, { value: 'esim', label: 'eSIM' }]} />
            </div>
            <div>
              <p className="text-sm font-bold">{t('유심')}</p>
              <Choice name="simBuy" value={simBuy} onChange={setSimBuy}
                options={[{ value: 'buy', label: '유심구매' }, { value: 'own', label: '유심보유' }]} />
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-soft p-6">
          <h2 className="text-base font-black">{t('신청자 정보')}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              {t('이름 (외국인등록증 기준)')} <span className="text-brand">*</span>
              <input name="name" required maxLength={50} className={inputClass} />
            </label>
            <label className="block text-sm font-bold">
              {t('국적')} <span className="text-brand">*</span>
              <input name="nationality" required maxLength={40} className={inputClass} />
            </label>
            <label className="block text-sm font-bold">
              {t('연락처')} <span className="text-brand">*</span>
              <input name="phone" type="tel" required maxLength={30} className={inputClass} />
            </label>
            <label className="block text-sm font-bold">
              {t('이메일')}
              <input name="email" type="email" maxLength={100} className={inputClass} />
            </label>
            {joinType === 'new' ? (
              <label className="block text-sm font-bold">
                {t('희망번호 끝 4자리')}
                <input name="wishNumber" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} className={inputClass} />
              </label>
            ) : (
              <label className="block text-sm font-bold">
                {t('현재 사용 중인 번호')} <span className="text-brand">*</span>
                <input name="currentNumber" type="tel" required maxLength={20} className={inputClass} />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {t('외국인등록증 번호는 이 화면에서 받지 않습니다. 상담원이 연락드려 안전하게 확인합니다.')}
          </p>
        </section>

        <section className="rounded-3xl bg-soft p-6">
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input name="agree" type="checkbox" required className="mt-0.5" />
            <span>{t('가입 상담을 위한 개인정보(이름, 국적, 연락처, 이메일) 수집·이용에 동의합니다.')}</span>
          </label>
          {error && <p className="mt-4 text-sm font-semibold text-brand">{error}</p>}
        </section>
      </div>

      <aside className="h-fit rounded-3xl bg-navy p-6 text-white md:sticky md:top-36">
        <p className="text-xs font-bold text-white/55">{t('월 납부금액')}</p>
        <p className="mt-1 text-3xl font-black">{selected ? won(selected.promoPrice) : '0원'}</p>
        {selected && (
          <>
            <p className="mt-1 text-xs text-white/40 line-through">{won(selected.price)}</p>
            <p className="mt-3 text-xs text-white/60">{t(selected.name)} · {selected.dataLabel}</p>
          </>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-6 w-full rounded-full bg-brand py-3.5 text-sm font-bold transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {status === 'sending' ? t('전송 중...') : t('가입접수 (상담원 개통)')}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-white/45">
          {t('접수 후 상담원이 전화로 본인 확인을 진행합니다.')}
        </p>
      </aside>
    </form>
  );
}
