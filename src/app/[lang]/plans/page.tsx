import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import PlanExplorer from '@/components/PlanExplorer';
import SampleNotice from '@/components/SampleNotice';
import { ExtraDict } from '@/components/LangProvider';
import { getPlans } from '@/lib/content/load';
import { getLang, withLang } from '@/lib/i18n';
import { DEFAULT_LANG } from '@/lib/langs';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('요금제 안내 | K-Telecom', '외국인 고객에게 맞춘 알뜰폰 요금제를 비교하고 신청하세요.');

async function PlansPage() {
  const all = (await getPlans()).plans;
  // 한국어 화면(한국인 고객)에서는 외국인 전용 요금제를 뺀다
  const plans = getLang() === DEFAULT_LANG ? all.filter((p) => !/foreigner|글로벌통화/i.test(p.name)) : all;
  // 사이트 사전에 없는 새 혜택·배지·안내 문구는 번역 저장소에서 꺼내거나 번역해서 저장해 둔다 (요금제 이름은 번역하지 않는다)
  const extra = await primeTranslations(plans.flatMap((p) => [...p.features, p.badge ?? '', /개월 후 [\d,]+원$/.test(p.promoNote) ? '' : p.promoNote]));

  return (
    <PageShell
      path="/plans" managed
      title="요금제 안내"
      lead="통신망, 데이터량, 요금으로 비교하고 나에게 맞는 요금제를 찾아보세요."
    >
      <SampleNotice />
      <ExtraDict extra={extra}>
        <PlanExplorer plans={plans} />
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(PlansPage);
