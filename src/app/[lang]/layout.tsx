import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import FloatingChat from '@/components/FloatingChat';
import LanguageGate from '@/components/LanguageGate';
import { LangProvider } from '@/components/LangProvider';
import TrafficTracker from '@/components/TrafficTracker';
import { dictionaryOf } from '@/lib/dictionaries';
import { t, setLang } from '@/lib/i18n';
import { DEFAULT_LANG, LANG_CODES, isLang, localizePath } from '@/lib/langs';
import { INDEXING_ALLOWED } from '@/lib/seo';

// 관리자에서 바꾼 배너·상품·헤더·푸터가 최대 60초 안에 사이트에 반영되도록 한다.
// (관리자에서 저장하면 바로 반영되도록 revalidatePath 도 함께 호출한다)
export const revalidate = 60;

// 한국어 주소(/)만 미리 만들어 두고, 다른 언어는 처음 열릴 때 만들어 저장한다.
export function generateStaticParams() {
  return [{ lang: DEFAULT_LANG }];
}

export const viewport: Viewport = {
  themeColor: '#0b1022',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  setLang(lang);
  const languages = Object.fromEntries(LANG_CODES.map((code) => [code, localizePath('/', code)]));
  return {
    robots: INDEXING_ALLOWED ? undefined : { index: false, follow: false, nocache: true },
    title: t('K-Telecom | 외국인 맞춤 통신·인터넷 원스톱'),
    description: t('스마트폰 단말할부, 알뜰폰 요금제, 인터넷·IPTV를 모국어로 한 번에. K-Telecom 제휴 신청'),
    alternates: { languages },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  setLang(lang);

  return (
    <html lang={lang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <LangProvider lang={lang} dict={dictionaryOf(lang)}>
          {children}
          <FloatingChat />
          <LanguageGate />
          <TrafficTracker />
        </LangProvider>
      </body>
    </html>
  );
}
