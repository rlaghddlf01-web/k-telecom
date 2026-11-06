import type { Metadata, Viewport } from 'next';
import './globals.css';
import FloatingChat from '@/components/FloatingChat';
import { t } from '@/lib/i18n';

export const viewport: Viewport = {
  themeColor: '#0b1022',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: t('K-Telecom | 외국인 맞춤 통신·인터넷 원스톱'),
  description: t('스마트폰 단말할부, 알뜰폰 요금제, 인터넷·IPTV를 모국어로 한 번에. K-Telecom 제휴 신청'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
