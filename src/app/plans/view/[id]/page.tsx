import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageShell from '@/components/PageShell';
import SampleNotice from '@/components/SampleNotice';
import { PLANS, findPlan, won } from '@/lib/plans';
import { t } from '@/lib/i18n';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PLANS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const plan = findPlan(id);
  return plan ? { title: `${t(plan.name)} | K-Telecom` } : {};
}

export default async function PlanDetailPage({ params }: Props) {
  const { id } = await params;
  const plan = findPlan(id);
  if (!plan) notFound();

  const rows: [string, string][] = [
    ['통신망', plan.network],
    ['데이터', plan.dataLabel],
    ['음성통화', plan.voice],
    ['문자', plan.sms],
    ['정상 요금', `${t('월')} ${won(plan.price)}`],
    ['할인 요금', `${t('월')} ${won(plan.promoPrice)} (${t(plan.promoNote)})`],
  ];

  return (
    <PageShell path="/plans" title={plan.name}>
      <SampleNotice />
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-3xl bg-gradient-to-br from-[#1b1550] to-brand p-8 text-white">
            <p className="text-xs font-bold tracking-widest text-white/70">{plan.network}</p>
            <h2 className="mt-2 text-2xl font-black">{t(plan.name)}</h2>
            <p className="mt-4 text-4xl font-black tracking-tight">{plan.dataLabel}</p>
            {plan.features.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{t(f)}</li>
                ))}
              </ul>
            )}
          </div>

          <h3 className="mb-3 mt-10 text-lg font-black">{t('요금제 상세')}</h3>
          <dl className="divide-y divide-black/5 rounded-2xl text-sm ring-1 ring-black/10">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3.5">
                <dt className="font-bold">{t(k)}</dt>
                <dd className="text-slate-600">{t(v)}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mb-3 mt-10 text-lg font-black">{t('유의사항')}</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
            <li>{t('할인 요금과 적용 기간은 사정에 따라 변경되거나 조기 종료될 수 있습니다.')}</li>
            <li>{t('가입 가능 여부와 회선 수 제한은 통신사 정책에 따라 달라질 수 있습니다.')}</li>
            <li>{t('자세한 내용은 가입 상담 시 안내해 드립니다.')}</li>
          </ul>
        </div>

        <aside className="h-fit rounded-3xl bg-soft p-6 md:sticky md:top-36">
          <p className="text-xs font-bold text-slate-400">{t('월 납부금액')}</p>
          <p className="mt-1 text-3xl font-black text-brand">{won(plan.promoPrice)}</p>
          <p className="mt-1 text-xs text-slate-400 line-through">{won(plan.price)}</p>
          <Link
            href={`/plans/apply?plan=${plan.id}`}
            className="mt-6 block rounded-full bg-brand py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {t('가입하기')}
          </Link>
          <Link
            href="/support/inquiry"
            className="mt-2 block rounded-full border border-black/15 py-3.5 text-center text-sm font-bold transition-colors hover:border-brand hover:text-brand"
          >
            {t('상담 요청')}
          </Link>
        </aside>
      </div>

      <Link href="/plans" className="mt-10 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> {t('목록으로')}
      </Link>
    </PageShell>
  );
}
