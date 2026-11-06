import Link from 'next/link';
import { Phone, MessageSquare } from 'lucide-react';
import { won, type Plan } from '@/lib/plans';
import { t } from '@/lib/i18n';

const NETWORK_TONE: Record<Plan['network'], string> = {
  SKT: 'bg-rose-50 text-rose-600',
  KT: 'bg-sky-50 text-sky-600',
  'LGU+': 'bg-fuchsia-50 text-fuchsia-600',
};

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className="relative flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
      {plan.badge && (
        <span className="absolute right-4 top-4 rounded-md bg-brand px-2 py-0.5 text-[10px] font-extrabold text-white">
          {t(plan.badge)}
        </span>
      )}
      <span className={`w-fit rounded-md px-2 py-0.5 text-[11px] font-extrabold ${NETWORK_TONE[plan.network]}`}>
        {plan.network}
      </span>
      <h3 className="mt-3 text-sm font-bold">{t(plan.name)}</h3>
      <p className="mt-2 text-2xl font-black tracking-tight">{plan.dataLabel}</p>

      <ul className="mt-3 space-y-1 text-xs text-slate-500">
        <li className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {t('음성')} {t(plan.voice)}</li>
        <li className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {t('문자')} {t(plan.sms)}</li>
      </ul>

      {plan.features.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {plan.features.map((f) => (
            <li key={f} className="rounded-full bg-soft px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {t(f)}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <p className="text-xs text-slate-400 line-through">{won(plan.price)}</p>
        <p className="text-xl font-black text-brand">
          {t('월')} {won(plan.promoPrice)}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">{t(plan.promoNote)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/plans/view/${plan.id}`}
            className="rounded-full border border-black/15 py-2.5 text-center text-xs font-bold transition-colors hover:border-brand hover:text-brand"
          >
            {t('자세히')}
          </Link>
          <Link
            href={`/plans/apply?plan=${plan.id}`}
            className="rounded-full bg-brand py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {t('가입하기')}
          </Link>
        </div>
      </div>
    </article>
  );
}
