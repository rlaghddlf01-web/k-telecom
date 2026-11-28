import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import CertGuide from '@/components/certGuide/CertGuide';
import { CERT_NOTE, CERT_OTHER_GUIDE, CERT_PREP, CERT_PREP_TITLE, CERT_TOSS_LINK } from '@/lib/guides/cert/certGuideStrings';
import { ExtraDict } from '@/components/LangProvider';
import { withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('PASS 인증서 만들기 | K-Telecom');

/** PASS 앱에서 PASS 인증서를 만드는 단계별 안내. 이지텍스의 PASS 안내(발급 부분)를 가져온 것이다 */
const TITLE = 'PASS 인증서 만들기';
const LEAD = 'PASS 앱 화면을 그대로 따라 하면서 PASS 인증서를 만듭니다. 설치와 가입부터 1원 계좌 인증까지 안내해요.';

async function PassGuidePage() {
  const extra = await primeTranslations([TITLE, LEAD, CERT_PREP_TITLE, ...CERT_PREP, CERT_NOTE, CERT_TOSS_LINK.label, CERT_OTHER_GUIDE.pass.label]);
  return (
    <PageShell path="/guide/pass" title={TITLE} lead={LEAD}>
      <ExtraDict extra={extra}>
        <CertGuide kind="pass" />
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(PassGuidePage);
