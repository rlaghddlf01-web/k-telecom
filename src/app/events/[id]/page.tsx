import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PostArticle from '@/components/PostArticle';
import { EVENTS } from '@/lib/boards';
import { t } from '@/lib/i18n';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = EVENTS.find((p) => p.id === id);
  return post ? { title: `${t(post.title)} | K-Telecom` } : {};
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const post = EVENTS.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <PageShell path="/events" title={post.title}>
      <PostArticle post={post} backHref="/events" />
    </PageShell>
  );
}
