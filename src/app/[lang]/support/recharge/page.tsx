import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import RechargeForm from '@/components/RechargeForm';
import { ExtraDict } from '@/components/LangProvider';
import { RECHARGE_TEXTS } from '@/lib/recharge';
import { withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('선불 충전 요청 | K-Telecom');

async function RechargePage() {
  const extra = await primeTranslations([...RECHARGE_TEXTS]);
  return (
    <PageShell path="/support/recharge" title={RECHARGE_TEXTS[0]} lead={RECHARGE_TEXTS[1]}>
      <ExtraDict extra={extra}>
        <div className="mx-auto max-w-2xl">
          <RechargeForm />
        </div>
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(RechargePage);
