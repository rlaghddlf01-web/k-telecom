import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import TossGuide from '@/components/tossGuide/TossGuide';
import { withLang } from '@/lib/i18n';
import { primeTranslations } from '@/lib/server/prime';

export const generateMetadata = pageMeta('토스 인증서 만들기 | K-Telecom');

/** 프리티 셀프개통의 본인확인(토스 인증)에 쓰는 토스 인증서를 만드는 단계별 안내. 이지텍스의 토스 안내(발급 부분)를 가져온 것이다 */
const TITLE = '토스 인증서 만들기';
const LEAD = '프리티 셀프개통에서 본인확인에 쓰는 토스 인증서를 앱 화면 그대로 따라 하면서 만듭니다.';

async function TossGuidePage() {
  // 제목·설명은 사이트 사전에 없으므로 번역 저장소에서 꺼내거나 번역해서 저장해 둔다 (슬라이드 설명은 자체 15개 언어 문구)
  await primeTranslations([TITLE, LEAD]);
  return (
    <PageShell path="/guide/toss" title={TITLE} lead={LEAD}>
      <TossGuide />
    </PageShell>
  );
}

export default withLang(TossGuidePage);
