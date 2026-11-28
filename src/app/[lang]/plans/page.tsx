import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import PlanExplorer from '@/components/PlanExplorer';
import SampleNotice from '@/components/SampleNotice';
import { ExtraDict } from '@/components/LangProvider';
import { getPlans } from '@/lib/content/load';
import Link from '@/components/LocaleLink';
import { t, withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('요금제 안내 | K-Telecom', '외국인 고객에게 맞춘 알뜰폰 요금제를 비교하고 신청하세요.');

const INFO_LINK = '가입 전 확인하세요: 후불 가입 조건 · 요금제 변경 · 선불 이용 · 추가 데이터 안내 보기';

async function PlansPage({ searchParams }: { searchParams?: Promise<{ billing?: string }> }) {
  const q = (await searchParams)?.billing;
  const initialBilling = q === 'prepaid' ? 'prepaid' : q === 'post' ? 'post' : 'all';
  // 국제전화 요금제(글로벌통화 등)도 한국어 화면에 그대로 보여 준다 (해외에 전화가 많은 한국 분도 쓴다)
  const plans = (await getPlans()).plans;
  // 사이트 사전에 없는 새 혜택·배지·안내 문구는 번역 저장소에서 꺼내거나 번역해서 저장해 둔다 (요금제 이름은 번역하지 않는다)
  const extra = await primeTranslations([
    ...plans.flatMap((p) => [...p.features, p.badge ?? '', /개월 후 [\d,]+원$/.test(p.promoNote) ? '' : p.promoNote]),
    INFO_LINK,
  ]);

  return (
    <PageShell
      path="/plans" managed
      title="요금제 안내"
      lead="통신망, 데이터량, 요금으로 비교하고 나에게 맞는 요금제를 찾아보세요."
    >
      <SampleNotice />
      <ExtraDict extra={extra}>
        <PlanExplorer key={initialBilling} plans={plans} initialBilling={initialBilling} />
        <p className="mt-8 rounded-2xl bg-soft px-5 py-4 text-sm font-semibold text-slate-600">
          <Link href="/plans/info" className="font-extrabold text-brand underline underline-offset-4">
            {t(INFO_LINK)}
          </Link>
        </p>
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(PlansPage);
