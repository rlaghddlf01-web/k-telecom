import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PartnershipForm from '@/components/PartnershipForm';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('제휴 신청 | K-Telecom'),
  description: t('단말 할부, 알뜰폰, 인터넷·IPTV 제휴 문의를 접수합니다.'),
};

export default function PartnershipPage() {
  return (
    <PageShell
      path="/partnership" managed
      title="제휴 신청"
      lead="외국인 대상 통신 상품 공급을 함께할 파트너사를 모십니다."
    >
      <PartnershipForm />
    </PageShell>
  );
}
