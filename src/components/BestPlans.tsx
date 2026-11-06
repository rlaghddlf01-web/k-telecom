import Link from 'next/link';
import PlanCard from '@/components/PlanCard';
import SampleNotice from '@/components/SampleNotice';
import { PLANS } from '@/lib/plans';
import { t } from '@/lib/i18n';

const PICKS = ['basic-3g', 'talk-7g', 'data-15g', 'unlimited'];

export default function BestPlans() {
  const picks = PICKS.map((id) => PLANS.find((p) => p.id === id)).filter((p): p is (typeof PLANS)[number] => !!p);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex items-end justify-between">
        <h2 className="section-title">{t('추천 요금제 BEST')}</h2>
        <Link href="/plans" className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-brand">
          {t('전체 요금제 보기')}
        </Link>
      </div>
      <div className="mt-6">
        <SampleNotice />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((p) => (
          <li key={p.id}>
            <PlanCard plan={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
