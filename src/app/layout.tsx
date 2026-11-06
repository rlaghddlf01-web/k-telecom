import type { Metadata, Viewport } from 'next';
import './globals.css';
import FloatingChat from '@/components/FloatingChat';
import { INDEXING_ALLOWED } from '@/lib/seo';
import { t } from '@/lib/i18n';

// 관리자에서 바꾼 배너·상품·헤더·푸터가 최대 60초 안에 사이트에 반영되도록 한다.
// (관리자에서 저장하면 바로 반영되도록 revalidatePath 도 함께 호출한다)
export const revalidate = 60;

export const viewport: Viewport = {
  themeColor: '#0b1022',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  robots: INDEXING_ALLOWED ? undefined : { index: false, follow: false, nocache: true },
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
