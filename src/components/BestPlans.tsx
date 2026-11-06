import Link from 'next/link';
import PlanCard from '@/components/PlanCard';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { ht } from '@/lib/content/homeText';

export default async function BestPlans({ title }: { title?: string }) {
  const { plans } = await getPlans();
  // 배지가 붙은 요금제를 먼저, 그다음 순서대로 4개
  const picks = [...plans.filter((p) => p.badge), ...plans.filter((p) => !p.badge)].slice(0, 4);
  if (picks.length === 0) return null;

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
