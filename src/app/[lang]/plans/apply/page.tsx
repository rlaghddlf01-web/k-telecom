import { Suspense } from 'react';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import ApplyForm from '@/components/ApplyForm';
import SampleNotice from '@/components/SampleNotice';
import { getContentPage, getPlans } from '@/lib/content/load';
import PageBlocks from '@/components/PageBlocks';
import { blockTexts } from '@/lib/content/blockTexts';
import { t, withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('가입 방법 | K-Telecom');

const WAYS = [
  '직접 가입 (셀프개통)',
  '한국 휴대폰 번호가 있으면 프리티 가입 화면에서 바로 가입할 수 있습니다. 가입 화면은 한국어라서 단계별 안내를 준비했습니다.',
];

async function ApplyPage() {
  const { plans } = await getPlans();
  // 아래에 붙이는 셀프개통 안내는 /plans/self 페이지의 내용을 그대로 쓴다 (관리자에서 고친 내용도 같이 반영)
  const guide = await getContentPage('/plans/self');
  await primeTranslations([...WAYS, '셀프개통 안내', ...(guide ? blockTexts(guide.blocks) : [])]);

  return (
    <PageShell
      path="/plans/apply" managed
      title="가입 방법"
      lead="요금제를 고른 뒤 프리티 가입 화면에서 직접 가입합니다."
    >
      <div className="mb-8 grid gap-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-2 ring-brand/30">
          <p className="text-base font-black">{t(WAYS[0])}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(WAYS[1])}</p>
        </div>
      </div>
      <SampleNotice />
      <Suspense fallback={null}>
        <ApplyForm plans={plans} />
      </Suspense>
      {guide && (
        <section id="self-guide" className="mt-14 scroll-mt-40">
          <h2 className="mb-6 text-xl font-black">{t('셀프개통 안내')}</h2>
          <PageBlocks blocks={guide.blocks} />
        </section>
      )}
    </PageShell>
  );
}

export default withLang(ApplyPage);
