import Link from '@/components/LocaleLink';
import PlanCard from '@/components/PlanCard';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { ht } from '@/lib/content/homeText';
import { NETWORKS, type Plan } from '@/lib/plans';
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
 * 홈 추천 요금제: 월 1만원대(10,000~19,999원) 후불 요금제를 8개(2줄) 고른다.
 * 할인이 오래가고, 인기·특가 배지가 있고, 데이터가 많은 순으로 점수를 매기고 통신망이 골고루 섞이게 번갈아 뽑는다.
 * 1만원대가 8개에 못 미치면 월 요금이 낮은 요금제로 채운다.
 */
function pickPlans(plans: Plan[]): Plan[] {
  const postpaid = plans.filter((p) => (p.billing ?? 'post') === 'post');
  const tenK = postpaid.filter((p) => p.promoPrice >= 10000 && p.promoPrice < 20000);
  const score = (a: Plan, b: Plan) =>
    durability(b.promoNote) - durability(a.promoNote) ||
    (BADGE_RANK[b.badge ?? ''] ?? 0) - (BADGE_RANK[a.badge ?? ''] ?? 0) ||
    b.dataGB - a.dataGB ||
    a.promoPrice - b.promoPrice;

  const byNetwork = NETWORKS.map((n) => tenK.filter((p) => p.network === n).sort(score));
  const picks: Plan[] = [];
  for (let i = 0; picks.length < PICK_COUNT && byNetwork.some((list) => i < list.length); i += 1) {
    for (const list of byNetwork) if (i < list.length && picks.length < PICK_COUNT) picks.push(list[i]);
  }
  if (picks.length < PICK_COUNT) {
    const rest = postpaid.filter((p) => !picks.includes(p)).sort((a, b) => a.promoPrice - b.promoPrice);
    picks.push(...rest.slice(0, PICK_COUNT - picks.length));
  }
  return picks;
}

export default async function BestPlans({ title }: { title?: string }) {
  const { plans } = await getPlans();
  const picks = pickPlans(plans);
  if (picks.length === 0) return null;
  const extra = await primeTranslations(picks.flatMap((p) => [...p.features, p.badge ?? '', /개월 후 [\d,]+원$/.test(p.promoNote) ? '' : p.promoNote]));

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="flex items-end justify-between">
        <h2 className="section-title">{title || ht('추천 요금제 BEST')}</h2>
        <Link href="/plans" className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-brand">
          {ht('전체 요금제 보기')}
        </Link>
      </div>
      <div className="mt-6">
        <SampleNotice />
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
