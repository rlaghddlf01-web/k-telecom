import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PostArticle from '@/components/PostArticle';
import { getEvents } from '@/lib/content/load';

interface Props {
  params: Promise<{ id: string }>;
}

// 관리자에서 새 이벤트를 등록하면 미리 만들어 두지 않은 주소도 열려야 하므로 dynamicParams 를 막지 않는다.
export async function generateStaticParams() {
  return (await getEvents()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = (await getEvents()).find((p) => p.id === id);
  return post ? { title: `${post.title} | K-Telecom` } : {};
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const post = (await getEvents()).find((p) => p.id === id);
  if (!post) notFound();

  return (
    <PageShell path="/events" title={post.title}>
      <PostArticle post={post} backHref="/events" />
    </PageShell>
  );
}
