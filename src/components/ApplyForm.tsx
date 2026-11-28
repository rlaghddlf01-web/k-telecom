'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { inputClass } from '@/components/formStyles';
import { NETWORKS, won, type Network, type Plan } from '@/lib/plans';
import { useT } from '@/components/LangProvider';
import { planText } from '@/lib/planText';

function Choice({
  name, options, value, onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useT();
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

export default function ApplyForm(props: { plans: Plan[] }) {
  const t = useT();
  const params = useSearchParams();
  const allPlans = props.plans;
  const findPlan = (id: string) => allPlans.find((p) => p.id === id);
  const initialPlan = findPlan(params.get('plan') ?? '');

  const [joinType, setJoinType] = useState('new');
  const [network, setNetwork] = useState<Network>(initialPlan?.network ?? 'SKT');
  const [billing, setBilling] = useState('post');
  const [planId, setPlanId] = useState(initialPlan?.id ?? '');
  const [sim, setSim] = useState('usim');
  const [simBuy, setSimBuy] = useState('buy');

  const plans = useMemo(() => allPlans.filter((p) => p.network === network), [allPlans, network]);
  const selected = findPlan(planId);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_280px]">
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
                  {t(p.name)} · {t('월')} {won(p.promoPrice, t)}
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

      </div>

      <aside className="h-fit rounded-3xl bg-navy p-6 text-white md:sticky md:top-36">
        <p className="text-xs font-bold text-white/55">{t('월 납부금액')}</p>
        <p className="mt-1 text-3xl font-black">{selected ? won(selected.promoPrice, t) : '-'}</p>
        {selected && (
          <>
            <p className="mt-1 text-xs text-white/40 line-through">{won(selected.price, t)}</p>
            <p className="mt-3 text-xs text-white/60">{t(selected.name)} · {planText(selected.dataLabel, t)}</p>
          </>
        )}
      </aside>
    </div>
  );
}
