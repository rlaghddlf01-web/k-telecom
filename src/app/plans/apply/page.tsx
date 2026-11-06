import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageShell from '@/components/PageShell';
import ApplyForm from '@/components/ApplyForm';
import SampleNotice from '@/components/SampleNotice';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('가입접수 | K-Telecom'),
};

export default function ApplyPage() {
  return (
    <PageShell
      path="/plans/apply"
      title="가입접수"
      lead="신청서를 남기시면 상담원이 연락드려 본인 확인과 개통을 도와드립니다."
    >
      <SampleNotice />
      <Suspense fallback={null}>
        <ApplyForm />
      </Suspense>
    </PageShell>
  );
}
