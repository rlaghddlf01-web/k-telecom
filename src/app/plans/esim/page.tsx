import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CardSim, Info } from 'lucide-react';
import PageShell from '@/components/PageShell';
import EsimGuide from '@/components/EsimGuide';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('eSIM 안내 | K-Telecom'),
};

export default function EsimPage() {
  return (
    <PageShell
      path="/plans/esim"
      title="eSIM 안내"
      lead="유심을 기다리지 않고 바로 개통하는 eSIM을 안내합니다."
    >
      <div className="space-y-10">
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t('온라인 접수 기능은 준비 중입니다. 현재는 1:1 상담문의로 신청해 주시면 담당자가 연락드립니다.')}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Clock, title: '1분 즉시 개통', desc: '배송을 기다릴 필요 없이 바로 사용합니다.' },
            { icon: CardSim, title: '실물 유심도 선택 가능', desc: 'eSIM이 어려운 단말은 실물 유심을 무료로 배송합니다.' },
          ].map(({ icon: Icon, title, desc }) => (
            <li key={title} className="rounded-2xl bg-soft p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-extrabold">{t(title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t(desc)}</p>
            </li>
          ))}
        </ul>

        <section>
          <h2 className="mb-4 text-lg font-black">{t('eSIM 활성화 방법')}</h2>
          <EsimGuide />
        </section>

        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-black">{t('eSIM으로 가입하시려면')}</p>
            <p className="mt-1 text-sm text-white/65">{t('가입접수에서 SIM 유형을 eSIM으로 선택해 주세요.')}</p>
          </div>
          <Link href="/plans/apply" className="shrink-0 rounded-full bg-brand px-7 py-3 text-sm font-bold hover:bg-brand-dark">
            {t('가입접수')}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
