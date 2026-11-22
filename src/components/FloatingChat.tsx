import ChatWidget from '@/components/ChatWidget';
import { getChatSettings, getSiteSettings } from '@/lib/content/load';
import { chatChannels } from '@/lib/content/chat';
import { getLang, t } from '@/lib/i18n';
import { DEFAULT_LANG } from '@/lib/langs';
import { AI_PHONE } from '@/lib/site';
import { primeTranslations } from '@/lib/server/prime';

const PHONE_TEXTS = ['AI 전화 상담', '24시간 · 한국어와 외국어로 바로 상담'];

/** 오른쪽 아래 상담 창: 관리자의 [상담 창] 탭 설정을 읽어 현재 언어로 바꿔 내려 준다 */
export default async function FloatingChat() {
  const [settings, site] = await Promise.all([getChatSettings(), getSiteSettings(), primeTranslations(PHONE_TEXTS)]);
  // 한국어 화면(한국인 고객)에는 카카오톡만 보여 주고, 왓츠앱·텔레그램·페이스북 메신저는 외국어 화면에서만 보여 준다
  const channels = chatChannels(settings)
    .filter(({ id }) => getLang() !== DEFAULT_LANG || id === 'kakao')
    .map(({ id, label, href }) => ({ id, label: t(label), href }));

  return (
    <ChatWidget
      managerName={t(settings.managerName)}
      managerRole={t(settings.managerRole)}
      intro={t(settings.intro)}
      teaser={t(settings.teaser)}
      avatar={settings.avatar}
      aiEnabled={settings.aiEnabled}
      phone={site.footer.company.phone}
      aiPhone={AI_PHONE.number}
      aiPhoneLabel={t(PHONE_TEXTS[0])}
      aiPhoneNote={t(PHONE_TEXTS[1])}
      channels={channels}
    />
  );
}
