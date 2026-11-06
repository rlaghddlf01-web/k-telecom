import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import PlanExplorer from '@/components/PlanExplorer';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('요금제 안내 | K-Telecom'),
  description: t('외국인 고객에게 맞춘 알뜰폰 요금제를 비교하고 신청하세요.'),
};

export default async function PlansPage() {
  const { plans } = await getPlans();

  return (
    <PageShell
      path="/plans" managed
      title="요금제 안내"
      lead="통신망, 데이터량, 요금으로 비교하고 나에게 맞는 요금제를 찾아보세요."
    >
      <SampleNotice />
      <PlanExplorer plans={plans} />
    </PageShell>
  );
}
