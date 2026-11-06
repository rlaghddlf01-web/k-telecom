import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageBlocks from '@/components/PageBlocks';
import { PAGES, findPage } from '@/lib/pages';
import { t } from '@/lib/i18n';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.path.split('/').filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage('/' + slug.join('/'));
  if (!page) return {};
  return { title: `${t(page.title)} | K-Telecom`, description: page.lead ? t(page.lead) : undefined };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const path = '/' + slug.join('/');
  const page = findPage(path);
  if (!page) notFound();

  return (
    <PageShell path={page.path} title={page.title} lead={page.lead}>
      <PageBlocks blocks={page.blocks} />
    </PageShell>
  );
}
