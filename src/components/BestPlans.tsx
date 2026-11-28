import Link from '@/components/LocaleLink';
import PlanCard from '@/components/PlanCard';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { ht } from '@/lib/content/homeText';
import type { Plan } from '@/lib/plans';
import { ExtraDict } from '@/components/LangProvider';
import { primeTranslations } from '@/lib/server/prime';

const PICK_COUNT = 8; // 4개씩 2줄

const BADGE_RANK: Record<string, number> = { 인기: 3, 특가: 2, 추천: 1 };

/** 할인이 오래가는 요금제를 먼저: 평생 할인 > 12개월 이상 > 그 밖 */
function durability(note: string) {
  if (note === '평생 할인') return 2;
  const m = note.match(/^(\d+)개월 후/);
  return m && Number(m[1]) >= 12 ? 1 : 0;
}

/**
 * 홈 추천 요금제: 후불 요금제 중 첫 달(현재 월) 요금이 가장 싼 8개(2줄).
 */
function pickPlans(plans: Plan[], billing: 'post' | 'prepaid'): Plan[] {
  const postpaid = plans.filter((p) => (p.billing ?? 'post') === billing);
  // 첫 달 요금이 가장 싼 순. 같으면 할인이 오래가는 것, 배지, 데이터 많은 순
  return [...postpaid]
    .sort(
      (a, b) =>
        a.promoPrice - b.promoPrice ||
        durability(b.promoNote) - durability(a.promoNote) ||
        (BADGE_RANK[b.badge ?? ''] ?? 0) - (BADGE_RANK[a.badge ?? ''] ?? 0) ||
        b.dataGB - a.dataGB,
    )
    .slice(0, PICK_COUNT);
}

export default async function BestPlans({ title, billing = 'post' }: { title?: string; billing?: 'post' | 'prepaid' }) {
  const { plans } = await getPlans();
  const picks = pickPlans(plans, billing);
  if (picks.length === 0) return null;
  const extra = await primeTranslations(picks.flatMap((p) => [...p.features, p.badge ?? '', /개월 후 [\d,]+원$/.test(p.promoNote) ? '' : p.promoNote]));

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex items-end justify-between">
        <h2 className="section-title">{title || (billing === 'prepaid' ? ht('선불 요금제') : ht('추천 요금제 BEST'))}</h2>
        <Link href={billing === 'prepaid' ? '/plans?billing=prepaid' : '/plans'} className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-brand">
          {ht('전체 요금제 보기')}
        </Link>
        {billing === 'prepaid' && (
          <Link href="/support/recharge" className="ml-3 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark">
            {ht('충전 요청하기')}
          </Link>
        )}
      </div>
      <div className="mt-6">
        {billing === 'prepaid' ? <p className="text-sm text-slate-500">{ht('선불 요금제는 충전해서 쓰는 방식입니다.')}</p> : <SampleNotice />}
      </div>
      <ExtraDict extra={extra}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <li key={p.id}>
              <PlanCard plan={p} />
            </li>
          ))}
        </ul>
      </ExtraDict>
    </section>
  );
}
