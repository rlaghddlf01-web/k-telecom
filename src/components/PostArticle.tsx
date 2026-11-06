import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Post } from '@/lib/boards';
import { t } from '@/lib/i18n';

export default function PostArticle({ post, backHref }: { post: Post; backHref: string }) {
  return (
    <article>
      <header className="border-y border-black/10 py-5">
        <h2 className="text-xl font-black leading-snug">{t(post.title)}</h2>
        <p className="mt-2 text-xs text-slate-400">
          {post.period ? `${t('기간')}: ${t(post.period)} · ` : ''}
          {post.date}
        </p>
      </header>
      <div className="space-y-3 py-8 text-sm leading-relaxed text-slate-600">
        {post.body.map((p) => (
          <p key={p}>{t(p)}</p>
        ))}
      </div>
      <div className="border-t border-black/10 pt-6">
        <Link href={backHref} className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-sm font-bold hover:border-brand hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> {t('목록으로')}
        </Link>
      </div>
    </article>
  );
}
