import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PostArticle from '@/components/PostArticle';
import { getNotices } from '@/lib/content/load';

interface Props {
  params: Promise<{ id: string }>;
}

// 관리자에서 새 공지를 등록하면 미리 만들어 두지 않은 주소도 열려야 하므로 dynamicParams 를 막지 않는다.
export async function generateStaticParams() {
  return (await getNotices()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = (await getNotices()).find((p) => p.id === id);
  return post ? { title: `${post.title} | K-Telecom` } : {};
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const post = (await getNotices()).find((p) => p.id === id);
  if (!post) notFound();

  return (
    <PageShell path="/support/notice" title="공지사항">
      <PostArticle post={post} backHref="/support/notice" />
    </PageShell>
  );
}
