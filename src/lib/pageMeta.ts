import type { Metadata } from 'next';
import { setLang, t } from '@/lib/i18n';
import { isLang } from '@/lib/langs';

/** 고정 제목·설명을 가진 페이지의 메타데이터: 주소의 언어에 맞춰 번역해서 돌려준다 */
export function pageMeta(title: string, description?: string) {
  return async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    if (isLang(lang)) setLang(lang);
    return { title: t(title), description: description ? t(description) : undefined };
  };
}
