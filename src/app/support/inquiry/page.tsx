import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import InquiryForm from '@/components/InquiryForm';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('1:1 상담문의 | K-Telecom'),
};

export default function InquiryPage() {
  return (
    <PageShell
      path="/support/inquiry"
      title="1:1 상담문의"
      lead="궁금한 점을 남겨주시면 담당자가 연락드립니다."
    >
      <InquiryForm />
    </PageShell>
  );
}
