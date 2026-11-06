import ChatWidget from '@/components/ChatWidget';
import { getChatSettings, getSiteSettings } from '@/lib/content/load';
import { chatChannels } from '@/lib/content/chat';
import { t } from '@/lib/i18n';

/** 오른쪽 아래 상담 창: 관리자의 [상담 창] 탭 설정을 읽어 현재 언어로 바꿔 내려 준다 */
export default async function FloatingChat() {
  const [settings, site] = await Promise.all([getChatSettings(), getSiteSettings()]);
  const channels = chatChannels(settings).map(({ id, label, href }) => ({ id, label: t(label), href }));

  return (
    <ChatWidget
      managerName={t(settings.managerName)}
      managerRole={t(settings.managerRole)}
      intro={t(settings.intro)}
      avatar={settings.avatar}
      aiEnabled={settings.aiEnabled}
      phone={site.footer.company.phone}
      channels={channels}
    />
  );
}
