import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageBlocks from '@/components/PageBlocks';
import { getContentPage } from '@/lib/content/load';
import { setLang, t, withLang } from '@/lib/i18n';
import { isLang } from '@/lib/langs';
import { blockTexts } from '@/lib/content/blockTexts';
import { primeTranslations } from '@/lib/server/prime';

interface Props {
  params: Promise<{ lang: string; slug: string[] }>;
}

// 관리자가 새로 만든 페이지도 열려야 하므로 미리 만들어 둔 주소만 허용하지 않는다.
export const dynamicParams = true;

/** 기본 페이지는 처음 열릴 때 만들어 두고, 새로 만든 페이지는 요청이 오면 그때 만든다 */
export async function generateStaticParams() {
  const [{ PAGES }, { getCustomPagePaths }] = await Promise.all([import('@/lib/pages'), import('@/lib/content/load')]);
  const custom = await getCustomPagePaths();
  return [...PAGES.map((p) => p.path), ...custom].map((p) => ({ slug: p.split('/').filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (isLang(lang)) setLang(lang);
  const page = await getContentPage('/' + slug.join('/'));
  if (!page) return {};
  return { title: `${t(page.title)} | K-Telecom`, description: page.lead ? t(page.lead) : undefined };
}

async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const path = '/' + slug.join('/');
  const page = await getContentPage(path);
  if (!page) notFound();

  // 사이트 사전에 없는 문구(새로 넣은 안내 문구)는 번역 저장소에서 꺼내거나 번역해서 저장해 둔다
  await primeTranslations([page.title, page.lead ?? '', ...blockTexts(page.blocks)]);

  return (
    <PageShell path={page.path} title={page.title} lead={page.lead}>
      <PageBlocks blocks={page.blocks} />
    </PageShell>
  );
}

export default withLang(ContentPage);
