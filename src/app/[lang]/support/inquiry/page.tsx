import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import InquiryForm from '@/components/InquiryForm';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('1:1 상담문의 | K-Telecom');

function InquiryPage() {
  return (
    <PageShell
      path="/support/inquiry" managed
      title="1:1 상담문의"
      lead="궁금한 점을 남겨주시면 담당자가 연락드립니다."
    >
      <InquiryForm />
    </PageShell>
  );
}

export default withLang(InquiryPage);
