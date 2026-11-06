import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import PlanExplorer from '@/components/PlanExplorer';
import SampleNotice from '@/components/SampleNotice';
import { getPlans } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('요금제 안내 | K-Telecom', '외국인 고객에게 맞춘 알뜰폰 요금제를 비교하고 신청하세요.');

async function PlansPage() {
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

export default withLang(PlansPage);
