import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PhonesCatalog from '@/components/PhonesCatalog';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('단말 목록 | K-Telecom'),
  description: t('갤럭시 A시리즈 신제품과 정품 검수 리퍼비시 아이폰을 초기비용 0원으로.'),
};

export default function PhonesPage() {
  return (
    <PageShell
      path="/phones"
      title="단말 목록"
      lead="갤럭시 A시리즈 미개봉 신제품과 정품 검수 리퍼비시 아이폰을 초기비용 0원으로 만나보세요."
    >
      <PhonesCatalog />
    </PageShell>
  );
}
