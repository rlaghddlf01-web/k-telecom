import { Suspense } from 'react';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import ApplyForm from '@/components/ApplyForm';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('가입접수 | K-Telecom');

async function ApplyPage() {
  const { plans } = await getPlans();

  return (
    <PageShell
      path="/plans/apply" managed
      title="가입접수"
      lead="신청서를 남기시면 상담원이 연락드려 본인 확인과 개통을 도와드립니다."
    >
      <SampleNotice />
      <Suspense fallback={null}>
        <ApplyForm plans={plans} />
      </Suspense>
    </PageShell>
  );
}

export default withLang(ApplyPage);
