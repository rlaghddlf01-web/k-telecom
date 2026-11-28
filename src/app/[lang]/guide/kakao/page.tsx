import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import CertGuide from '@/components/certGuide/CertGuide';
import { CERT_NOTE, CERT_OTHER_GUIDE, CERT_PREP, CERT_PREP_TITLE, CERT_TOSS_LINK } from '@/lib/guides/cert/certGuideStrings';
import { ExtraDict } from '@/components/LangProvider';
import { withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('카카오톡 인증서 만들기 | K-Telecom');

/** 카카오톡 앱에서 카카오 인증서를 만드는 단계별 안내. 이지텍스의 카카오톡 안내(발급 부분)를 가져온 것이다 */
const TITLE = '카카오톡 인증서 만들기';
const LEAD = '카카오톡 앱 화면을 그대로 따라 하면서 카카오 인증서를 만듭니다. 설치와 가입부터 1원 계좌 인증까지 안내해요.';

async function KakaoGuidePage() {
  const extra = await primeTranslations([TITLE, LEAD, CERT_PREP_TITLE, ...CERT_PREP, CERT_NOTE, CERT_TOSS_LINK.label, CERT_OTHER_GUIDE.kakao.label]);
  return (
    <PageShell path="/guide/kakao" title={TITLE} lead={LEAD}>
      <ExtraDict extra={extra}>
        <CertGuide kind="kakao" />
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(KakaoGuidePage);
