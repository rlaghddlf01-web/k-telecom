import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PostArticle from '@/components/PostArticle';
import { NOTICES } from '@/lib/boards';
import { t } from '@/lib/i18n';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTICES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = NOTICES.find((p) => p.id === id);
  return post ? { title: `${t(post.title)} | K-Telecom` } : {};
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const post = NOTICES.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <PageShell path="/support/notice" title="공지사항">
      <PostArticle post={post} backHref="/support/notice" />
    </PageShell>
  );
}
