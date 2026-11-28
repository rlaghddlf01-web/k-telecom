import { Suspense } from 'react';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import ApplyForm from '@/components/ApplyForm';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import Link from '@/components/LocaleLink';
import { t, withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('가입접수 | K-Telecom');

const WAYS = [
  '직접 가입 (셀프개통)',
  '한국 휴대폰 번호가 있으면 프리티 가입 화면에서 바로 가입할 수 있습니다. 가입 화면은 한국어라서 단계별 안내와 용어표를 준비했습니다.',
  '셀프개통 안내 보기',
  '상담으로 가입',
  '아래 신청서를 남기면 상담원이 연락드립니다. 한국 휴대폰이 없는 경우에도 먼저 문의해 주세요.',
];

async function ApplyPage() {
  const { plans } = await getPlans();
  await primeTranslations(WAYS);

  return (
    <PageShell
      path="/plans/apply" managed
      title="가입접수"
      lead="신청서를 남기시면 상담원이 연락드려 본인 확인과 개통을 도와드립니다."
    >
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-2 ring-brand/30">
          <p className="text-base font-black">{t(WAYS[0])}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(WAYS[1])}</p>
          <Link href="/plans/self" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
            {t(WAYS[2])}
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10">
          <p className="text-base font-black">{t(WAYS[3])}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(WAYS[4])}</p>
        </div>
      </div>
      <SampleNotice />
      <Suspense fallback={null}>
        <ApplyForm plans={plans} />
      </Suspense>
    </PageShell>
  );
}

export default withLang(ApplyPage);
